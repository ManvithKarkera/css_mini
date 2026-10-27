# Simulation Guide

How to run the SYN Flood Virtual Lab and how to read what it shows.

## 1. Opening the lab

| Option | How |
|---|---|
| Source version | Double-click `index.html`. It works from `file://`, so no web server or internet connection is needed. |
| Built version | Open `dist/index.html`. It is the same lab packed into three files (`index.html`, `style.css`, `script.js`). |
| Rebuild `dist/` | Run `node build.js` in the project folder (requires Node.js). |

The lab uses plain HTML, CSS and JavaScript with no backend and no libraries. It is deterministic: a seeded random number generator means the same settings always give the same result.

## 2. Screen layout

| Area | What it shows |
|---|---|
| **Header** | Progress (Theory → Experiment → Defences → Review), the **Theory**, **Terminal** and **Stop** buttons, and the **Lab menu** (Reset current run, Restart lab). |
| **Experiment Steps** | The nine steps (locked, current or done) and the current step's instructions and buttons. |
| **Network Topology** | Diagram of the Legitimate Client, Simulated Traffic Generator, Target Server, TCP Connection Queue and Network Status Indicator, with animated packets. Click any component for a short description. A packet colour legend sits in the top-right corner. |
| **Backlog machine** | A live figure under the diagram: each SYN becomes a token on a belt that ends up in the queue cabinet, against the closed gate (rejected), against the firewall or turnstile (filtered), or under the stamp press (SYN cookie). A gauge shows queue use. |
| **TCP Connection Queue** | 100 slots. Free slots are light grey, legitimate slots are **blue and rounded**, attack slots are **dark charcoal and square**. When all 100 are full, new SYNs are rejected. |
| **Network Status Indicator** | The server state badge: **Healthy** (green), **Under Pressure** (amber), **Degraded** (orange, dashed border) or **Unavailable** (red, dotted border). |
| **Simulation Controls** | **Generate Baseline Traffic**, the **Attack level** selector (Low, Medium, High), **Start SYN Flood**, **Stop Simulation**, and a progress bar for the current run. |
| **Live Dashboard** | Incoming SYN/s, Pending (half-open), Completed legitimate connections, Rejected or timed-out, Queue utilisation, Server resource usage (CPU), Avg response time (ms), Service availability, plus a history chart of availability and queue utilisation. All values are marked *Simulated data*. |
| **Mitigation** | Four switches (SYN cookies, Rate limiting, Shorter timeouts, Firewall filtering) that are set by your terminal configuration, and **Run With Mitigation**. |
| **Comparison** | Baseline vs attack vs mitigated: peak pending connections, legitimate connection success, average response time, peak CPU, average availability and final server state. |
| **Experiment Log** | A time-stamped record of what happened in each run. |
| **Terminal** | A drawer docked to the bottom of the page: a simulated Linux shell on `web01` with a **Guided runbook**, suggestion chips, and **Resize**, **Clear** and **Close** buttons. |

## 3. Packet legend

Packet colours come from the tokens in `css/base.css` and the packet classes in `css/lab.css`. Colour is never the only signal: size, ring and dash pattern differ too.

| Packet | Look | CSS class | Meaning |
|---|---|---|---|
| Legitimate SYN | Solid **blue** circle (`#1a56f0`) | `.packet--legit` | A real client asks to connect. |
| ACK | Solid **blue** circle (`#1a56f0`) | `.packet--ack` | The client completes the handshake; the slot is freed. |
| Attack SYN | Larger **dark charcoal** circle (`#36383c`) with a dark ring | `.packet--attack` | A flood SYN that will mostly never be answered. |
| SYN-ACK | **Amber** circle (`#9a6200`) | `.packet--synack` | The server's reply; the connection is now half-open. |
| Rejected | **Grey** circle (`#7a7f87`) with a dashed dark ring | `.packet--rejected` | The queue was full, so the SYN was turned away. |
| Filtered | **Grey** circle (`#7a7f87`) with a dashed charcoal ring | `.packet--filtered` | Dropped by the firewall or rate limit before reaching the queue. |
| SYN cookie | **Blue** circle with a thick **dotted** dark ring | `.packet--cookie` | The server answered with a SYN cookie instead of using a queue slot. |

**On-screen legend.** The Network Topology header shows a compact legend with two chips: **Legitimate** (blue dot) and **Attack** (charcoal dot). The full table above covers the other packet types.

## 4. Walkthrough

1. **Baseline.** Press **Generate Baseline Traffic**. Legitimate clients send about 5 SYN/s and each completes its handshake after about 1 s, so the queue stays almost empty, availability stays near 100% and the badge stays **Healthy**. The run lasts 20 simulated seconds and is kept for comparison.
2. **Attack.** Pick an **Attack level** and press **Start SYN Flood**. The run lasts 40 simulated seconds.

   | Level | Attack SYN/s | Share that never completes |
   |---|---|---|
   | Low | 4 | 50% |
   | Medium | 15 | 80% |
   | High | 50 | 95% |

   Attack slots stay occupied until the ~30 s timeout, so the queue fills, pending connections and CPU climb, response time rises, and once the queue is full legitimate SYNs are rejected and availability falls. Watch the badge move towards **Degraded** or **Unavailable**.
3. **Mitigation.** In the terminal, configure the server (see section 5). The Mitigation switches update automatically:
   - **SYN cookies** turn on when `net.ipv4.tcp_syncookies` is 1 or 2.
   - **Shorter timeouts** turn on when `net.ipv4.tcp_synack_retries` is 3 or lower.
   - **Rate limiting** turns on with a global SYN limit (an `iptables -m limit ... -j ACCEPT` rule followed by a SYN `DROP` rule, or an `nft` equivalent) at or above the normal customer peak of about 150 SYN/s. A per-source limit does not count, because a spoofed flood uses a different source for every packet.
   - **Firewall filtering** turns on when SYNPROXY is fully set up: the raw-table `CT --notrack` rule, the `SYNPROXY` rule, `nf_conntrack_tcp_loose = 0` and SYN cookies on.

   Then press **Run With Mitigation** to replay the same attack.
4. **Compare.** The **Comparison** table puts the baseline, attack and mitigated runs side by side, with an explanation underneath.
5. **Workshop.** The Defender's Workshop has five modules: Understand (SYN queue vs accept queue, SYN cookies, the arithmetic of exhaustion), Investigate (dashboard, `dmesg`, `tcpdump` and `ss` evidence), Harden (a checklist done in the terminal, then a test against the same attack), Choose layers (host tuning, firewall, proxy, scrubbing, ISP) and Run the incident (on-call decisions with explained consequences).
6. **Quiz.** One question at a time with four options, **Submit**, immediate feedback and **Next**. The quiz contains 12 questions: 6 from `js/content.js` plus 6 scenario questions added by `js/workshop-content.js`.

After everything is complete, a summary shows availability under attack, with mitigation and for the hardened server, plus the quiz score. **🎓 Get Certificate** opens the certificate section.

## 5. Terminal commands

Open the terminal with the **Terminal** button or Ctrl+`. It opens automatically at Step 6. Up/Down arrows recall earlier commands, Esc closes the drawer, and `sudo` is accepted. Nothing on the real computer is touched.

| Group | Commands |
|---|---|
| Measure | `ss -tan state syn-recv \| wc -l`, `netstat -ant \| grep -c SYN_RECV`, `ss -s`, `netstat -s \| grep -i listen`, `dmesg \| tail`, `journalctl -k`, `tcpdump -nn -c 10 'tcp[tcpflags] == tcp-syn'`, `curl -I --max-time 5 https://shop.example/` |
| Kernel | `sysctl <key>`, `sysctl -w <key>=<value>`, `sysctl -a \| grep syn`, `sysctl --system`, `sysctl -p <file>`, `cat /etc/sysctl.d/99-synflood.conf`, `cat /proc/sys/...`, `echo "<line>" >> /etc/sysctl.d/99-synflood.conf`, `ls /etc/sysctl.d` |
| Firewall | `iptables -L -n -v`, `iptables -S`, `iptables -A INPUT ...`, `iptables -t raw -A PREROUTING ...`, `iptables -F`, `nft list ruleset`, `nft add rule inet filter input ...`, `ipset create <name> hash:ip`, `ipset add <name> <address>` |
| Filters (after `\|`) | `grep [-i -v -c]`, `wc -l`, `head -n N`, `tail -n N`, `tee [-a] <file>` |
| Other | `help`, `clear`, `hostname`, `whoami`, `id`, `uname -a`, `date`, `pwd`, `uptime` |

Tunable keys: `net.ipv4.tcp_syncookies`, `net.ipv4.tcp_max_syn_backlog`, `net.core.somaxconn`, `net.ipv4.tcp_synack_retries`, `net.ipv4.tcp_abort_on_overflow`, `net.ipv4.tcp_timestamps`, `net.netfilter.nf_conntrack_tcp_loose`.

The suggestion chips under the prompt offer: `help`, `ss -tan state syn-recv | wc -l`, `dmesg | tail`, `sysctl -a | grep syn`, `sysctl -w net.ipv4.tcp_syncookies=1`, `iptables -S`.

### Guided runbook

The terminal's runbook has 13 required steps and 3 bonus steps. A step completes when the server's state satisfies it, so any equivalent command also counts.

| # | Step | Command |
|---|---|---|
| 1 | Measure: count half-open connections | `ss -tan state syn-recv \| wc -l` |
| 2 | Read the kernel log | `dmesg \| tail` |
| 3 | Capture attack packets as evidence | `tcpdump -nn -c 10 'tcp[tcpflags] == tcp-syn'` |
| 4 | Check whether SYN cookies are on | `sysctl net.ipv4.tcp_syncookies` |
| 5 | Mitigation 1: enable SYN cookies | `sysctl -w net.ipv4.tcp_syncookies=1` |
| 6 | Mitigation 2: expire half-open entries sooner | `sysctl -w net.ipv4.tcp_synack_retries=2` |
| 7 | Mitigation 3a: allow SYNs up to a global limit | `iptables -A INPUT -p tcp --syn --dport 443 -m limit --limit 400/s --limit-burst 800 -j ACCEPT` |
| 8 | Mitigation 3b: drop SYNs above the limit | `iptables -A INPUT -p tcp --syn --dport 443 -j DROP` |
| 9 | Verify the firewall rules | `iptables -S` |
| 10 | Make it permanent: cookies | `echo "net.ipv4.tcp_syncookies = 1" >> /etc/sysctl.d/99-synflood.conf` |
| 11 | Make it permanent: SYN-ACK retries | `echo "net.ipv4.tcp_synack_retries = 2" >> /etc/sysctl.d/99-synflood.conf` |
| 12 | Load the file and confirm it parses | `sysctl --system` |
| 13 | Verify from the customer's side | `curl -I --max-time 5 https://shop.example/` |
| Bonus | SYNPROXY, strict conntrack | `sysctl -w net.netfilter.nf_conntrack_tcp_loose=0` |
| Bonus | Do not track incoming SYNs | `iptables -t raw -A PREROUTING -p tcp -m tcp --syn --dport 443 -j CT --notrack` |
| Bonus | Add the SYNPROXY rule | `iptables -A INPUT -p tcp -m tcp --dport 443 -m conntrack --ctstate INVALID,UNTRACKED -j SYNPROXY --sack-perm --timestamp --wscale 7 --mss 1460` |

## 6. Things to try

- Run the attack at **Low**, **Medium** and **High** and note how quickly the queue fills and when the badge changes state.
- Enable **only one** defence at a time and press **Run With Mitigation**. Which single defence helps most at High?
- Set `net.ipv4.tcp_synack_retries=0` and read the warning: entries are freed instantly but genuine clients on lossy links break.
- Set a global rate limit **below** 150 SYN/s and see that the lab warns you are blocking genuine customers.
- Add a per-source limit (`--hashlimit-mode srcip` or `connlimit`) instead of a global one and see why it does not stop a spoofed flood.
- Add only the `SYNPROXY` rule without the `--notrack` rule and `nf_conntrack_tcp_loose=0`, then complete the setup and compare.
- Change settings with `sysctl -w` only, then persist them to `/etc/sysctl.d/99-synflood.conf` and run `sysctl --system`.
- Compare the dashboard's history chart for the attack run and the mitigated run.

## 7. Feedback form and certificate

After the lab is complete, **🎓 Get Certificate** opens the **Lab Completion Certificate** section. It first shows an optional **Quick Feedback** form: a required 1–5 star rating, *What did you find most useful?*, *What could be improved?* and a difficulty selector. Press **Submit Feedback** to send it, or **Skip & Get Certificate**. Then enter your full name, press **Generate Certificate**, and use **⬇ Download as PDF** to save it.

## 8. Safety note

- The SYN flood, the network and the Linux server are **all simulated inside the browser**. No attack traffic is generated and no real system is changed. All numbers are educational estimates, not real benchmarks.
- The only thing the page ever sends over the network is the optional feedback form, which is submitted to the Web3Forms service if you press **Submit Feedback**.
- Use what you learn to defend systems. **Never** send flood traffic to a network you do not own or do not have written permission to test. Doing so is illegal in most countries.
