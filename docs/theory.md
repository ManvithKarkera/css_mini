# Theory

## 1. TCP and the three-way handshake

The Transmission Control Protocol (TCP) is how most of the internet delivers data reliably: web pages, email and file transfers all use it. Before any data moves, the two computers must agree to talk, and TCP does this with a short exchange called the **three-way handshake**. The computer that starts the conversation is the **client**. The computer that waits for connections is the **server**. A server can only keep track of a limited number of connections at once, so each new connection uses a small piece of its memory.

| Step | Message | Sent by | Meaning |
|---|---|---|---|
| 1 | **SYN** ("synchronise") | Client → Server | "I would like to open a connection." The server notes the request and sets aside a small amount of memory to remember it. |
| 2 | **SYN-ACK** ("synchronise-acknowledge") | Server → Client | "I received your request, and I am ready." The connection is now **half-open**: the server is waiting for the client to answer. |
| 3 | **ACK** ("acknowledge") | Client → Server | "Got it, let us begin." The connection is fully established, the server frees the waiting slot, and data can flow. |

```
   Client                              Server
     |                                    |
     |  ---------- SYN --------------->   |   server reserves a queue slot
     |                                    |
     |  <-------- SYN-ACK -------------   |   connection is HALF-OPEN
     |                                    |
     |  ---------- ACK --------------->   |   ESTABLISHED, slot freed
     |                                    |
```

## 2. The SYN flood attack

In a SYN flood, an attacker sends a huge number of SYN messages but **never sends the final ACK**. Often the source addresses are **spoofed** (fake), so the server's SYN-ACK replies go nowhere. Each unanswered request stays in the server's **backlog queue** as a half-open connection for about 30 seconds before it times out. When the queue is full, the server has no room left and must turn new connections away, including real ones. The attacker does not need to break in or steal anything; filling the queue is enough.

In the lab the server's queue has **100 slots**. Legitimate clients complete their handshake after about one second and free their slot; attack SYNs mostly never complete and hold their slot until the timeout.

### The pizza-shop analogy

Imagine a pizza shop with a counter that holds 100 orders. Pranksters phone in hundreds of orders with fake names and never come to collect them. The shop keeps each pizza on the counter for half a minute, just in case. Soon the counter is full of orders nobody will pick up, and real customers who walk in are told to come back later. The shop is working perfectly well, but it cannot serve the people it exists for.

| Pizza shop | TCP server |
|---|---|
| Counter with room for 100 orders | Backlog queue (100 slots) |
| Prank orders with fake names | Half-open connections from spoofed SYNs |
| Pizza kept for half a minute | Half-open timeout (~30 s) |
| Real customers turned away | Lost availability |

## 3. Availability, DoS and DDoS

Information security is often summarised by the **CIA triad**:

- **Confidentiality**: only authorised people can read the data.
- **Integrity**: data is not changed without authorisation.
- **Availability**: the people who should be able to use a service can use it when they need to.

A SYN flood is a **denial-of-service (DoS)** attack because it targets **availability**: the server is still running, but real customers cannot get through. Confidentiality and integrity are untouched. When the flood comes from many machines at once (for example a botnet), it is a **distributed denial-of-service (DDoS)** attack, which is harder to block because there is no single source to filter.

In this lab, availability is measured as **the percentage of legitimate connection attempts that succeed over the last five simulated seconds**. The lab also tracks the queue, the processor (CPU) load and the response time, which usually get worse before availability collapses.

## 4. Server states

The Network Status Indicator summarises the health of the service from availability, queue use and CPU load.

| State | Meaning |
|---|---|
| **Healthy** | Almost every legitimate connection succeeds and the queue has plenty of room. |
| **Under Pressure** | The queue or the CPU is getting busy. Service still works, but it has little spare capacity. |
| **Degraded** | Many legitimate users are failing to connect, or the queue is nearly full. Responses are slow. |
| **Unavailable** | Almost no legitimate user can connect. The attack has taken the service offline. |

## 5. Defences and their limitations

| Defence | How it works | Limitation |
|---|---|---|
| **SYN cookies** | When the queue is full, the server stops keeping a slot for each new SYN. It encodes the connection details into its SYN-ACK reply and only creates a real connection if a valid ACK comes back. Genuine clients are still served, while fake ones cost no memory. | Each cookie still costs CPU and bandwidth, a few TCP options are lost, and a very large flood can still overwhelm the network link. |
| **Rate limiting** | The server or firewall accepts only a fixed number of new connections per second. Anything above the limit is dropped before it can take a slot, which caps how fast the queue can fill. | A limit that is too low also blocks genuine bursts of traffic, and an attacker who spreads the flood over many sources can stay under a per-source limit. |
| **Shorter timeouts** | The server waits less time for the final ACK before giving up on a half-open connection. Slots held by attack traffic are freed within seconds instead of half a minute. | Slow but genuine clients (for example on poor mobile networks) may be dropped too, and a faster flood simply refills the slots sooner. |
| **Firewall filtering** | A firewall or intrusion-prevention system blocks traffic that matches attack patterns before it reaches the server. In this simulation it removes most of the attack SYNs. | It cannot tell well-disguised spoofed traffic from real traffic, so some attack packets get through and some genuine ones are blocked by mistake. |

## 6. The matching Linux settings

The lab's terminal simulates a Linux server (`web01`). These are the real kernel and firewall settings behind each defence:

| Setting | What it does | Lab starting value | Defence |
|---|---|---|---|
| `net.ipv4.tcp_syncookies` | `0` = off, `1` = send SYN cookies when the SYN backlog overflows, `2` = always send cookies. | `0` (off) | SYN cookies (on when ≥ 1) |
| `net.ipv4.tcp_synack_retries` | How many times the server resends an unanswered SYN-ACK before dropping the half-open entry. The kernel default of 5 keeps an entry for about 63 s; 2 drops it after about 7 s. | `5` | Shorter timeouts (on when 1–3; 0 also counts but breaks clients on lossy links) |
| `net.ipv4.tcp_max_syn_backlog` | Maximum number of half-open connections remembered. A larger queue buys time and absorbs bursts, but a sustained flood still fills it. | `256` | Supporting setting (not one of the four switches) |
| `iptables ... -m limit ... -j ACCEPT` followed by `iptables ... --syn ... -j DROP` | A global SYN rate limit: accept SYNs up to a rate, drop the rest. It does not depend on the (forged) source address. | no rules | Rate limiting (only if the limit is at or above the normal customer peak of about 150 SYN/s) |
| `iptables -t raw ... -j CT --notrack` + `iptables ... -j SYNPROXY` + `nf_conntrack_tcp_loose = 0` | SYNPROXY: the firewall completes the handshake itself and only passes connections that proved they are real. | not configured | Firewall filtering |

Settings changed with `sysctl -w` are lost on reboot. To make them permanent, write them to a file such as `/etc/sysctl.d/99-synflood.conf` and load it with `sysctl --system`.

Notes from the lab's evaluation of the configuration:

- A per-source limit (`hashlimit --hashlimit-mode srcip`, `connlimit`, `recent`) does **not** stop a spoofed flood, because every packet claims a different source address.
- A static blocklist (`ipset`) does not help against forged, changing source addresses and can block innocent networks.
- A rate-limit `ACCEPT` rule on its own changes nothing when the default policy is `ACCEPT`; a `DROP` rule for SYN packets must follow it.

## 7. Key takeaway: defence in depth

A SYN flood does not break into a server: it simply uses up a limited resource, the backlog queue. Every defence trades something off: cookies cost CPU, rate limits can block real bursts, shorter timeouts can drop slow clients, and firewalls miss disguised traffic. No single defence gives 100% protection, so real systems **layer several defences** (host tuning, firewall rules, proxies, upstream scrubbing by the provider) and still plan for incidents.
