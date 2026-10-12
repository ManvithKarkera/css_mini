/* ===== js/content.js ===== */
/* ==========================================================================
   content.js — OWNER: Meet Mangaonkar
   Purpose: all student-facing text and the quiz (Lab.Content, CONTRACT §5.7).
   A complete first draft: please fact-check, tighten the wording, and replace
   the nine guidelines with the exact wording from the professor's brief.
   Conventions: "simulated" is used consistently; nothing here claims a real
   attack happens. Plain text only (workflow.js inserts it with textContent).
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  Lab.Content = {
    title: 'SYN Flood Virtual Lab',

    objective: 'Demonstrate the effect of a SYN Flood attack on network availability.',

    disclaimer: 'Everything in this lab is simulated inside your browser. All numbers are educational estimates, not real benchmarks, and no network traffic is sent.',

    // TODO (Meet): replace with the nine "Before You Begin" instructions from the brief.
    guidelines: [
      'This lab is a browser-only simulation. No real network traffic is created and nothing leaves your computer.',
      'All numbers you see are simulated educational estimates, not measurements of a real system.',
      'Work through the nine steps in order. A step unlocks when you finish the one before it.',
      'Read the theory first. You can reopen it at any time with the Theory button in the header.',
      'Always run the baseline before the attack, so you have a healthy server to compare against.',
      'Use Stop to halt a simulation immediately. Your results stay on screen so you can study them.',
      'Change the defences only while no simulation is running.',
      'Use Reset to start the experiment again. If you already have results, you will be asked to confirm.',
      'Use what you learn to defend systems. Never send flood traffic to a network you do not own or have written permission to test.'
    ],

    theory: {
      tcp: 'The Transmission Control Protocol (TCP) is how most of the internet delivers data reliably: web pages, email and file transfers all use it. Before any data moves, the two computers must agree to talk, and TCP does this with a short exchange called the three-way handshake. The computer that starts the conversation is the client. The computer that waits for connections is the server. A server can only keep track of a limited number of connections at once, so each new connection uses a small piece of its memory.',

      handshake: [
        {
          name: 'SYN',
          text: 'The client sends a SYN ("synchronise") message to say: "I would like to open a connection." The server notes the request and sets aside a small amount of memory to remember it.'
        },
        {
          name: 'SYN-ACK',
          text: 'The server replies with a SYN-ACK ("synchronise-acknowledge"): "I received your request, and I am ready." At this point the connection is half-open, because the server is waiting for the client to answer.'
        },
        {
          name: 'ACK',
          text: 'The client sends a final ACK ("acknowledge"): "Got it, let us begin." The connection is now fully established, the server frees the waiting slot, and data can flow.'
        }
      ],

      synFlood: 'In a SYN flood, an attacker sends a huge number of SYN messages but never sends the final ACK. Often the source addresses are spoofed, meaning they are fake, so the server\'s SYN-ACK replies go nowhere. Each unanswered request stays in the server\'s backlog queue as a half-open connection for about 30 seconds before it times out. When the queue is full, the server has no room left and must turn new connections away, including real ones. The attacker does not need to break in or steal anything; filling the queue is enough.',

      availability: 'Availability means that the people who should be able to use a service can use it when they need to. A SYN flood is a denial-of-service attack because it targets availability: the server is still running, but real customers cannot get through. In this lab we measure availability as the percentage of legitimate connection attempts that succeed over the last five simulated seconds. We also watch the queue, the processor load and the response time, which usually get worse before availability collapses.',

      analogy: 'Imagine a pizza shop with a counter that holds 100 orders. Pranksters phone in hundreds of orders with fake names and never come to collect them. The shop keeps each pizza on the counter for half a minute, just in case. Soon the counter is full of orders nobody will pick up, and real customers who walk in are told to come back later. The shop is working perfectly well, but it cannot serve the people it exists for. The counter is the TCP queue, the prank orders are half-open connections, and the turned-away customers are the lost availability.'
    },

    components: {
      client: {
        title: 'Legitimate Client',
        text: 'A normal user whose browser opens connections to the server. Every connection it starts completes the full handshake, so its slot is freed after about one second.'
      },
      generator: {
        title: 'Simulated Traffic Generator',
        text: 'Produces the simulated attack traffic. It sends SYN messages at the rate you choose, and most of them never send the final ACK. No real packets are sent.'
      },
      server: {
        title: 'Target Server',
        text: 'The simulated server that accepts connections. It keeps one slot in its queue for every half-open connection, and its CPU and response time depend on how busy that queue is.'
      },
      queue: {
        title: 'TCP Connection Queue',
        text: 'The backlog of half-open connections waiting for their final ACK. It has 100 slots. Green slots belong to legitimate clients and red slots to the attack. When it is full, new connections are rejected.'
      },
      status: {
        title: 'Network Status Indicator',
        text: 'Summarises the health of the service as Healthy, Under Pressure, Degraded or Unavailable, based on availability, queue use and CPU load.'
      }
    },

    steps: [
      {
        id: 1,
        title: 'Review the lab',
        instructions: 'Read the theory above and press Replay handshake to watch SYN, SYN-ACK and ACK happen. Click each part of the network diagram to see what it does. When you are ready, press Continue.'
      },
      {
        id: 2,
        title: 'Generate baseline traffic',
        instructions: 'Press Generate Baseline Traffic. Watch legitimate clients complete handshakes and notice that the server stays Healthy and the queue stays almost empty. The baseline runs for 20 simulated seconds and is saved for the comparison later.'
      },
      {
        id: 3,
        title: 'Launch the SYN flood',
        instructions: 'Choose an attack level (Low, Medium or High) and press Start SYN Flood. The traffic generator now sends SYN messages that never complete. Try the levels in turn if you like: each run replaces the previous attack.'
      },
      {
        id: 4,
        title: 'Observe the impact',
        instructions: 'Watch the queue fill with red attack slots. Follow the dashboard: pending connections, CPU and response time rise, then availability falls. Note the moment the server becomes Degraded or Unavailable, and check the log for what happened.'
      },
      {
        id: 5,
        title: 'Stop the attack',
        instructions: 'Press Stop whenever you have seen enough, or let the run finish after 40 simulated seconds. The simulation halts at once and every number stays on screen so you can study it.'
      },
      {
        id: 6,
        title: 'Enable mitigation',
        instructions: 'Open the terminal (Terminal button, top right). You are root on the simulated server web01: configure real defences with Linux commands such as sysctl and iptables. Type help to see what is supported. The switches below show which defences your configuration turns on. When at least one is on, press Run With Mitigation to replay the same attack against your configuration.'
      },
      {
        id: 7,
        title: 'Compare the results',
        instructions: 'Study the comparison table and the explanation under it. Which numbers improved most with your defences, and which stayed bad? When you have finished, press Continue.'
      },
      {
        id: 8,
        title: "Defender's workshop",
        instructions: 'The simulation showed what happens. Now learn how a real defender finds and stops it. Work through the five modules below: understand the kernel mechanism, investigate evidence, harden a Linux server with real commands, choose the right defence layers and run the incident. Finish all five to unlock the quiz.'
      },
      {
        id: 9,
        title: 'Test your knowledge',
        instructions: 'Answer the twelve quiz questions. You get feedback after each answer. Finish the quiz to complete the experiment.'
      }
    ],

    serverStates: {
      'Healthy': 'Almost every legitimate connection succeeds and the queue has plenty of room.',
      'Under Pressure': 'The queue or the CPU is getting busy. Service still works, but it has little spare capacity.',
      'Degraded': 'Many legitimate users are failing to connect, or the queue is nearly full. Responses are slow.',
      'Unavailable': 'Almost no legitimate user can connect. The attack has taken the service offline.'
    },

    mitigations: {
      synCookies: {
        title: 'SYN cookies',
        text: 'When the queue is full, the server stops keeping a slot for each new SYN. Instead it encodes the connection details into its SYN-ACK reply, and only creates a real connection if a valid ACK comes back. Genuine clients are still served, while fake ones cost no memory.',
        limitation: 'Each cookie still costs CPU and bandwidth, a few TCP options are lost, and a very large flood can still overwhelm the network link.'
      },
      rateLimit: {
        title: 'Rate limiting',
        text: 'The server or firewall accepts only a fixed number of new connections per second from the same source. Anything above the limit is dropped before it can take a slot, which caps how fast the queue can fill.',
        limitation: 'A limit that is too low also blocks genuine bursts of traffic, and an attacker who spreads the flood over many sources can stay under the limit.'
      },
      shortTimeout: {
        title: 'Shorter timeouts',
        text: 'The server waits less time for the final ACK before it gives up on a half-open connection. Slots occupied by attack traffic are freed within seconds instead of half a minute, so the queue struggles to fill.',
        limitation: 'Slow but genuine clients, for example on poor mobile networks, may be dropped too, and a faster flood simply refills the slots sooner.'
      },
      firewall: {
        title: 'Firewall filtering',
        text: 'A firewall or intrusion-prevention system blocks traffic that matches known attack patterns, such as addresses on a blocklist, before it reaches the server. In this simulation it removes most of the attack SYNs.',
        limitation: 'It cannot tell well-disguised spoofed traffic from real traffic, so some attack packets get through and some genuine ones are blocked by mistake.'
      }
    },

    quiz: [
      {
        id: 1,
        question: 'In which order are the messages of the TCP three-way handshake sent?',
        options: ['ACK, SYN, SYN-ACK', 'SYN, SYN-ACK, ACK', 'SYN, ACK, SYN-ACK', 'SYN-ACK, SYN, ACK'],
        answer: 1,
        explanation: 'The client sends SYN, the server answers with SYN-ACK, and the client finishes with ACK. Only after the final ACK is the connection established. A SYN flood abuses the gap between the second and third message.'
      },
      {
        id: 2,
        question: 'Why does a half-open connection use up server resources?',
        options: [
          'It downloads a large file to the server',
          'The server keeps a slot in its queue while it waits for the final ACK',
          'It encrypts all later traffic with a heavy algorithm',
          'It permanently blocks the client\'s address'
        ],
        answer: 1,
        explanation: 'For every SYN it accepts, the server stores state and keeps it until the handshake completes or times out. Many half-open connections therefore mean many occupied slots, even though no data was ever sent.'
      },
      {
        id: 3,
        question: 'What is the main effect of a successful SYN flood on a service?',
        options: [
          'Stored data is stolen from the server',
          'The server\'s files are encrypted and held for ransom',
          'Legitimate users can no longer connect, so availability falls',
          'The server\'s clock is changed'
        ],
        answer: 2,
        explanation: 'A SYN flood is a denial-of-service attack. It does not need to steal or change data. It only has to fill the connection queue so that genuine users are turned away, which is a loss of availability.'
      },
      {
        id: 4,
        question: 'How does attack traffic differ from legitimate traffic in this lab?',
        options: [
          'Attack clients send SYN messages but most never send the final ACK',
          'Attack traffic uses a different protocol from TCP',
          'Attack traffic is always much slower than legitimate traffic',
          'Legitimate clients never send a SYN message'
        ],
        answer: 0,
        explanation: 'Both kinds of traffic start with a SYN. Legitimate clients complete the handshake, so their slot is freed after about a second. Attack traffic leaves most connections half-open, so their slots stay occupied until the timeout.'
      },
      {
        id: 5,
        question: 'What problem do SYN cookies solve?',
        options: [
          'They make the SYN-ACK message encrypted',
          'They stop the attacker from ever sending a SYN',
          'They let the server answer SYNs without keeping a queue slot for each one',
          'They shorten the handshake to two messages'
        ],
        answer: 2,
        explanation: 'With SYN cookies the server stores no state at first. It hides the needed details in the SYN-ACK, so a full queue no longer blocks genuine clients. The attacker can still send SYNs, and each cookie still costs some CPU.'
      },
      {
        id: 6,
        question: 'Why can no single defence fully prevent denial-of-service attacks?',
        options: [
          'Defences only work when the server is switched off',
          'Each defence has limits, and attackers can adapt, spread their traffic or add more of it',
          'Denial-of-service attacks always use stolen passwords',
          'Defences are only available for UDP traffic'
        ],
        answer: 1,
        explanation: 'Every defence trades something off: cookies cost CPU, rate limits can block real bursts, shorter timeouts can drop slow clients, and firewalls miss disguised traffic. Real systems layer several defences and still have to plan for incidents.'
      }
    ],

    completion: {
      title: 'Experiment Completed Successfully!',
      message: 'You generated a baseline, launched a simulated SYN flood, watched the queue fill and the service fail, and measured how defences help. The key lesson: a SYN flood does not break into a server, it simply uses up a limited resource, and defence in depth is the best protection.'
    }
  };
})(window.Lab);

/* ===== js/workshop-content.js ===== */
/* ==========================================================================
   workshop-content.js — OWNER: Meet Mangaonkar (text), reviewed by Manvith Karkera
   Purpose: all text for "Part 2: Defender's Workshop" (Lab.Content.workshop).
   This is the part that teaches how a SYN flood is investigated and stopped on a
   real Linux server: kernel queues, the arithmetic of exhaustion, packet and log
   analysis, real sysctl / iptables / nftables commands, defence layers, and an
   incident-response playbook.

   Rich text is written as "blocks" (rendered by Lab.Workshop.renderBlocks):
     { t: 'h', x }  heading        { t: 'p', x }  paragraph (**bold** and `code` allowed)
     { t: 'ul'|'ol', items }       { t: 'code', x }  terminal-style block
     { t: 'note', title, x }       { t: 'table', head, rows }
   Everything is plain text; nothing here is ever inserted as HTML.
   NOTE: commands in this file are real Linux commands. The lab only SIMULATES them.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  Lab.Content = Lab.Content || {};

  Lab.Content.workshop = {
    title: "Part 2: Defender's Workshop",
    intro: 'The simulation showed you what a SYN flood does. This workshop shows you how a real defender finds it and stops it. You will do the work an on-call engineer does: understand the kernel mechanism, read evidence, harden a Linux server with real commands, choose the right defence layer, and run the incident. Finish all five modules to unlock the quiz.',

    scenario: {
      host: 'web01',
      ip: '203.0.113.10',
      story: 'You are the on-call engineer for an online shop. web01 is a single Linux web server (nginx on port 443) behind a 1 Gbit/s uplink. It normally handles up to about 150 new connections per second. At 02:14 monitoring reports timeouts for customers.',
      normalPeakSynPerSec: 150
    },

    modules: [
      { id: 'understand', title: 'Understand', blurb: 'What the kernel does, and the arithmetic of exhaustion.' },
      { id: 'investigate', title: 'Investigate', blurb: 'Read logs and packets to prove it is a SYN flood.' },
      { id: 'harden', title: 'Harden', blurb: 'Fix a Linux server with real commands.' },
      { id: 'layers', title: 'Choose layers', blurb: 'Match each problem to the right defence.' },
      { id: 'incident', title: 'Run the incident', blurb: 'Make the calls an on-call engineer makes.' }
    ],

    // ------------------------------------------------------------------ 1. UNDERSTAND
    understand: {
      blocks: [
        { t: 'h', x: 'What the kernel really does with a SYN' },
        { t: 'p', x: 'When a SYN arrives on a port that has a listening socket, the Linux kernel does **not** wait for the application. The kernel itself answers, and it remembers the half-finished handshake in a small record called a **request socket** (roughly a few hundred bytes plus a timer). These records live in the **SYN queue** (also called the request queue or half-open queue).' },
        { t: 'ol', items: [
          'SYN arrives. The kernel creates a request socket in the **SYN queue** (the connection is now in state `SYN-RECV`) and sends a SYN-ACK.',
          'If no ACK arrives, the kernel **retransmits the SYN-ACK** with exponential back-off: after 1, 2, 4, 8 and 16 seconds. The number of retransmissions is `net.ipv4.tcp_synack_retries` (default 5).',
          'If the final ACK arrives, the record moves to the **accept queue**, where it waits until the application calls `accept()`. The accept queue is limited by `net.core.somaxconn` and by the backlog the application passed to `listen()`.',
          'If the timers run out, the request socket is deleted. With 5 retries that is after 1+2+4+8+16+32 = **63 seconds**.'
        ] },
        { t: 'note', title: 'The key insight', x: 'A half-open connection costs the attacker one tiny packet and costs the server memory, a timer and up to six retransmitted replies. The attack works because of this **asymmetry**, not because the attacker is "stronger". It is a resource-exhaustion attack on a limited table.' },

        { t: 'h', x: 'The settings that control it' },
        { t: 'table', head: ['Setting (sysctl)', 'Typical default', 'What it controls'], rows: [
          ['net.ipv4.tcp_syncookies', '1 on most distributions', '0 = never use cookies. 1 = use cookies only when the SYN queue overflows. 2 = always use cookies.'],
          ['net.ipv4.tcp_max_syn_backlog', '128 to 4096 (scaled by RAM)', 'How many half-open connections the SYN queue may hold per listener.'],
          ['net.core.somaxconn', '4096 on kernels 5.4+, 128 before', 'Upper limit of the accept queue (completed handshakes waiting for the application).'],
          ['net.ipv4.tcp_synack_retries', '5', 'How many times a SYN-ACK is retransmitted. Fewer retries mean half-open entries are removed sooner.'],
          ['net.netfilter.nf_conntrack_tcp_loose', '1', 'Needed for SYNPROXY: must be 0 so the firewall does not accept mid-stream packets as new connections.']
        ] },

        { t: 'h', x: 'How SYN cookies work' },
        { t: 'p', x: 'When the SYN queue is full and `tcp_syncookies` is on, the kernel stops storing anything. It builds the **initial sequence number** of its SYN-ACK from a keyed hash of the connection (source and destination address and port), a coarse timestamp, and a few bits that encode the client\'s MSS. A real client echoes that number back in its ACK (as the acknowledgment number minus one). The kernel recomputes the hash; if it matches, the connection is real and is created at that moment. A spoofed SYN never produces an ACK, so it costs the server **no memory at all**.' },
        { t: 'p', x: 'The price: cookies cost CPU (a hash per SYN and per ACK), and they can carry only a few TCP options, which is why they are used only when the queue is already full. TCP timestamps are used to carry extra option bits, so do not disable `tcp_timestamps` on a server that relies on cookies.' },

        { t: 'h', x: 'Why the source address does not matter to the attacker' },
        { t: 'p', x: 'TCP gives the receiver no proof that the source address is genuine. The attacker forges a different source address in every SYN, so the server\'s SYN-ACKs go to innocent third parties (this reflected noise is called **backscatter**). Because there is no real source to throttle or block, blocking addresses you saw in a capture is almost always useless, and it can block real customers whose addresses were borrowed. The long-term fix is for networks to drop packets whose source address cannot be legitimate: **ingress filtering**, standardised as BCP 38 (RFC 2827), often done with unicast reverse-path filtering (uRPF).' },

        { t: 'h', x: 'The arithmetic: Little\'s law' },
        { t: 'p', x: 'In steady state, the number of entries in a queue equals **arrival rate multiplied by the time each entry stays**. For the SYN queue:' },
        { t: 'code', x: 'half-open entries  =  attack SYN rate  x  lifetime of an entry\nlifetime            =  2^(tcp_synack_retries + 1) - 1  seconds' },
        { t: 'p', x: 'Worked example: 500 spoofed SYN per second with the default 5 retries gives a lifetime of 63 s, so the server wants to hold 500 x 63 = **31,500** entries. With a backlog of 4,096 the queue is full. The attacker did not need to hold anything open: the server\'s own patience filled the table. Now try different settings below.' },

        { t: 'h', x: 'Which attacks does each tool cover?' },
        { t: 'table', head: ['Attack', 'What is exhausted', 'What helps', 'What does not'], rows: [
          ['SYN flood (spoofed)', 'SYN queue, CPU', 'SYN cookies, SYNPROXY, shorter SYN-ACK retries, global SYN limits', 'Blocking source IPs'],
          ['SYN flood from a botnet (real sources)', 'SYN queue, CPU', 'Cookies plus per-source limits and reputation filtering', 'Nothing alone is enough'],
          ['Volumetric flood (link saturated)', 'Bandwidth', 'Upstream scrubbing, CDN, provider filtering', 'Any setting on the server (packets never reach it)'],
          ['Connection exhaustion / Slowloris (full handshakes)', 'Accept queue, worker threads, file descriptors', 'Timeouts in the application, connection limits per source, a reverse proxy', 'SYN cookies (the handshake is genuine)'],
          ['ACK / RST floods', 'CPU, conntrack table', 'Stateless filtering, dropping INVALID packets', 'SYN-specific tuning']
        ] }
      ],

      calculator: {
        title: 'Check your understanding: size the fix',
        text: 'A spoofed flood arrives at 500 SYN per second. The SYN queue holds 4,096 entries (`tcp_max_syn_backlog = 4096`), and you are not allowed to use SYN cookies on this legacy box. What is the **largest** value of `tcp_synack_retries` that keeps the steady-state number of half-open entries at or below the backlog?',
        rate: 500,
        backlog: 4096,
        answer: 2,
        success: 'Correct. With 2 retries the lifetime is 2^3 - 1 = 7 s, so 500 x 7 = 3,500 entries, which fits in 4,096. With 3 retries the lifetime is 15 s and 500 x 15 = 7,500, which does not fit.',
        failure: 'Not yet. Work out the lifetime for a candidate value with 2^(retries + 1) - 1, multiply by 500 SYN/s, and compare with 4,096.',
        caveat: 'Real life adds a trade-off: a very low value also drops genuine clients on slow mobile links whose ACK is delayed, and it only works while the flood rate stays low enough. This is why cookies, not timers, are the main defence.'
      },

      checkpoints: [
        {
          id: 'u1',
          question: 'A legitimate client completes the handshake. Which queue does its connection sit in until the web server calls accept()?',
          options: ['The SYN queue', 'The accept queue', 'The conntrack table only', 'The ARP cache'],
          answer: 1,
          explanation: 'The SYN queue holds half-open connections. After the final ACK the request moves to the accept queue, which is limited by somaxconn and the application\'s listen() backlog.'
        },
        {
          id: 'u2',
          question: 'Why can a server with plenty of free RAM and an idle link still be taken down by a SYN flood?',
          options: [
            'The attacker fills the disk with log files',
            'The SYN queue is a fixed-size table, and once it is full new connections are refused regardless of free RAM',
            'SYN packets contain malware',
            'TCP stops working when the CPU is below 50%'
          ],
          answer: 1,
          explanation: 'The queue has a configured limit (tcp_max_syn_backlog). The attack exhausts that table, not memory or bandwidth, so the machine looks calm while customers get timeouts. That is why a flood can be missed if you only watch CPU and bandwidth.'
        },
        {
          id: 'u3',
          question: 'An administrator sets net.ipv4.tcp_syncookies = 0 "for performance". What changes during a flood?',
          options: [
            'Nothing, cookies are used only for encryption',
            'When the SYN queue is full the kernel can only drop new SYNs, so genuine customers are refused too',
            'The kernel answers every SYN with a RST',
            'The attack becomes harder because SYN-ACKs are encrypted'
          ],
          answer: 1,
          explanation: 'Without cookies there is no way to accept a connection without storing state, so a full queue means refusal for everyone. Cookies are the one mechanism that lets genuine clients through while the queue is full.'
        }
      ]
    },

    // ------------------------------------------------------------------ 2. INVESTIGATE
    investigate: {
      brief: 'Before you change anything, prove what is happening. A wrong diagnosis costs time: a crashed application, a flash sale and a SYN flood all look like "the site is down". Study the evidence from web01, then answer the four questions.',
      evidence: [
        {
          title: 'Monitoring dashboard (02:14)',
          lines: [
            'CPU load .............. 35 %',
            'Memory in use ......... 41 %',
            'Network in ............ 18 Mbit/s  (link: 1000 Mbit/s)',
            'Established conns ..... 211   (normal: about 200)',
            'HTTP 5xx / timeouts ... 94 % of customer requests',
            'nginx process ......... running, 0 restarts'
          ]
        },
        {
          title: 'Kernel log: dmesg | tail -n 3',
          lines: [
            '[ 8412.113456] TCP: request_sock_TCP: Possible SYN flooding on port 443. Dropping request.  Check SNMP counters.',
            '[ 8472.481902] TCP: request_sock_TCP: Possible SYN flooding on port 443. Dropping request.  Check SNMP counters.',
            '[ 8532.907311] TCP: request_sock_TCP: Possible SYN flooding on port 443. Dropping request.  Check SNMP counters.'
          ]
        },
        {
          title: 'Packet capture (first 16 SYN packets): tcpdump -nn -c 16 \'tcp[tcpflags] == tcp-syn\' and port 443',
          lines: [
            '02:14:07.100312 IP 91.208.17.4.31022   > 203.0.113.10.443: Flags [S], seq 1930412211, win 512, length 0',
            '02:14:07.100391 IP 185.33.201.90.2744  > 203.0.113.10.443: Flags [S], seq 77012003, win 512, length 0',
            '02:14:07.100470 IP 24.118.7.201.60117  > 203.0.113.10.443: Flags [S], seq 2840911122, win 512, length 0',
            '02:14:07.100552 IP 118.45.230.9.12984  > 203.0.113.10.443: Flags [S], seq 411230981, win 512, length 0',
            '02:14:07.100630 IP 5.188.62.140.45003  > 203.0.113.10.443: Flags [S], seq 3290127711, win 512, length 0',
            '02:14:07.100711 IP 200.57.11.33.8811   > 203.0.113.10.443: Flags [S], seq 1172209934, win 512, length 0',
            '02:14:07.100793 IP 77.91.154.18.52019  > 203.0.113.10.443: Flags [S], seq 610339018, win 512, length 0',
            '02:14:07.100874 IP 141.98.10.77.9120   > 203.0.113.10.443: Flags [S], seq 2299001235, win 512, length 0',
            '02:14:07.100952 IP 36.110.233.5.33310  > 203.0.113.10.443: Flags [S], seq 904412330, win 512, length 0',
            '02:14:07.101031 IP 62.210.5.201.17744  > 203.0.113.10.443: Flags [S], seq 3711009421, win 512, length 0',
            '02:14:07.101111 IP 190.12.88.64.64002  > 203.0.113.10.443: Flags [S], seq 55120934, win 512, length 0',
            '02:14:07.101190 IP 103.77.2.250.20777  > 203.0.113.10.443: Flags [S], seq 2012877340, win 512, length 0',
            '02:14:07.101271 IP 45.9.148.113.4115   > 203.0.113.10.443: Flags [S], seq 1388204412, win 512, length 0',
            '02:14:07.101352 IP 212.102.40.8.38812  > 203.0.113.10.443: Flags [S], seq 3099410021, win 512, length 0',
            '02:14:07.101430 IP 14.139.9.171.55290  > 203.0.113.10.443: Flags [S], seq 760218833, win 512, length 0',
            '02:14:07.101510 IP 168.196.41.6.27018  > 203.0.113.10.443: Flags [S], seq 1544910072, win 512, length 0'
          ]
        },
        {
          title: 'Connection states: ss -Htan | awk \'{print $1}\' | sort | uniq -c',
          lines: [
            '    211 ESTAB',
            '   4096 SYN-RECV',
            '      9 TIME-WAIT',
            '      4 LISTEN'
          ]
        }
      ],
      questions: [
        {
          id: 'i1',
          question: 'CPU is 35%, memory is 41% and the link is almost idle, yet 94% of customer requests fail. What does this combination tell you?',
          options: [
            'The link is saturated by a volumetric flood',
            'A limited table inside the server is exhausted (connection state), not raw capacity',
            'The disk is full',
            'nginx has crashed'
          ],
          answer: 1,
          explanation: 'Low CPU, low bandwidth and a running nginx point away from a volumetric flood and an application crash. Something with a fixed size is full. The state counts (4,096 in SYN-RECV, matching the backlog) show that it is the SYN queue.'
        },
        {
          id: 'i2',
          question: 'Look at the capture. All 16 packets have different source addresses from different countries, but identical window size (512) and the same destination port. What is the most likely explanation?',
          options: [
            'Sixteen different customers opened the shop at the same instant',
            'A traffic generator is sending SYN packets with forged source addresses',
            'The packets are a normal load balancer health check',
            'A DNS misconfiguration'
          ],
          answer: 1,
          explanation: 'Different genuine browsers would show different window sizes and sequence behaviour, and they would not all arrive within 1.2 ms. Identical packet fields with random sources are the signature of a tool that forges sources (hping3 style, window 512). Real customers also follow their SYN with an ACK.'
        },
        {
          id: 'i3',
          question: 'How can you tell a SYN flood from a flash crowd after a big marketing email?',
          options: [
            'A flash crowd has many ESTABLISHED connections and the queue drains; in a flood the SYN-RECV count stays high while ESTABLISHED does not grow',
            'There is no way to tell them apart',
            'A flash crowd only comes from one country',
            'A flood is always slower than a flash crowd'
          ],
          answer: 0,
          explanation: 'In a flash crowd the handshakes complete: ESTABLISHED and request rates rise and SYN-RECV stays short-lived. In a SYN flood, 4,096 connections sit in SYN-RECV, ESTABLISHED stays near normal (211 here), and the kernel log says "Possible SYN flooding".'
        },
        {
          id: 'i4',
          question: 'Your colleague proposes adding all 16 source addresses from the capture to a blocklist. What is the best response?',
          options: [
            'Good idea, do it for every address in the capture',
            'It will not help: the addresses are forged and change on every packet, and some belong to innocent networks',
            'Block the whole internet except your office',
            'Only block the first address'
          ],
          answer: 1,
          explanation: 'Spoofed sources make address blocklists useless and risk blocking real customers. Controls that do not depend on the source address (SYN cookies, SYNPROXY, global SYN limits, upstream scrubbing) are what work.'
        }
      ]
    },

    // ------------------------------------------------------------------ 3. HARDEN
    harden: {
      brief: 'web01 is under a spoofed SYN flood right now. You are root on the server. Work through the checklist by typing real Linux commands in the terminal pop-up (the Terminal button in the header). Type `help` to see what the lab supports. When your changes are in place, test the server under the same attack you ran in the simulation.',
      motd: [
        'web01 - Ubuntu 22.04 LTS (simulated)  |  you are root',
        'An attack is in progress on port 443. Type "help" for supported commands.',
        ''
      ],
      tasks: [
        {
          id: 'count', required: true,
          title: 'Count the half-open connections',
          why: 'Never change a system you have not measured. This gives you the number you will compare against later.',
          hint: 'ss -tan state syn-recv | wc -l   (or: netstat -ant | grep -c SYN_RECV)'
        },
        {
          id: 'klog', required: true,
          title: 'Read the kernel log',
          why: 'The kernel itself reports a possible SYN flood and tells you whether it is sending cookies or dropping requests.',
          hint: 'dmesg | tail      (or: journalctl -k | grep -i syn)'
        },
        {
          id: 'capture', required: true,
          title: 'Capture some attack packets as evidence',
          why: 'You need a sample for the post-incident review and for your upstream provider.',
          hint: "tcpdump -nn -c 10 'tcp[tcpflags] == tcp-syn'"
        },
        {
          id: 'cookies', required: true,
          title: 'Enable SYN cookies now (runtime)',
          why: 'This is the single most effective host-level change. It lets genuine clients through even when the queue is full.',
          hint: 'sysctl -w net.ipv4.tcp_syncookies=1'
        },
        {
          id: 'retries', required: true,
          title: 'Make half-open entries expire sooner',
          why: 'Using the arithmetic from Module 1: lifetime = 2^(retries+1) - 1. Choose a value between 1 and 3 (zero would hurt slow genuine clients).',
          hint: 'sysctl -w net.ipv4.tcp_synack_retries=2'
        },
        {
          id: 'backlog', required: false,
          title: 'Optional: give the queues more room',
          why: 'A larger backlog only buys time. Set tcp_max_syn_backlog and somaxconn to at least 2048 and note that the flood still fills it eventually.',
          hint: 'sysctl -w net.ipv4.tcp_max_syn_backlog=4096   and   sysctl -w net.core.somaxconn=4096'
        },
        {
          id: 'ratelimit', required: true,
          title: 'Add a global SYN rate limit at the firewall',
          why: 'The sources are spoofed, so a per-source limit is useless: the attacker uses a fresh address each time. Limit all new SYNs to the port. Keep the limit above your normal peak of about 150 per second or you will block customers.',
          hint: 'iptables -A INPUT -p tcp --syn --dport 443 -m limit --limit 400/s --limit-burst 800 -j ACCEPT\niptables -A INPUT -p tcp --syn --dport 443 -j DROP\n(or with nftables: nft add rule inet filter input tcp dport 443 tcp flags syn limit rate over 400/second drop)'
        },
        {
          id: 'persist', required: true,
          title: 'Make the settings survive a reboot',
          why: '`sysctl -w` changes only the running kernel. Put the settings in a file under /etc/sysctl.d/ and load it, or the fix disappears at the next reboot.',
          hint: 'echo "net.ipv4.tcp_syncookies = 1" >> /etc/sysctl.d/99-synflood.conf\necho "net.ipv4.tcp_synack_retries = 2" >> /etc/sysctl.d/99-synflood.conf\nsysctl --system'
        },
        {
          id: 'synproxy', required: false,
          title: 'Stretch goal: put SYNPROXY in front of the server',
          why: 'SYNPROXY lets the firewall complete the handshake itself and only forward connections that proved they are real. It needs conntrack in strict mode and cookies on.',
          hint: 'sysctl -w net.netfilter.nf_conntrack_tcp_loose=0\niptables -t raw -A PREROUTING -p tcp -m tcp --syn --dport 443 -j CT --notrack\niptables -A INPUT -p tcp -m tcp --dport 443 -m conntrack --ctstate INVALID,UNTRACKED -j SYNPROXY --sack-perm --timestamp --wscale 7 --mss 1460'
        }
      ],
      reference: [
        { t: 'h', x: 'Field reference' },
        { t: 'code', x: '# measure\nss -tan state syn-recv | wc -l          # half-open connections\nnetstat -s | grep -i listen              # queue overflow counters\ndmesg | tail                             # kernel messages\ntcpdump -nn -c 10 \'tcp[tcpflags] == tcp-syn\'\n\n# kernel hardening (runtime)\nsysctl -w net.ipv4.tcp_syncookies=1\nsysctl -w net.ipv4.tcp_synack_retries=2\nsysctl -w net.ipv4.tcp_max_syn_backlog=4096\nsysctl -w net.core.somaxconn=4096\n\n# make it permanent\necho "net.ipv4.tcp_syncookies = 1" >> /etc/sysctl.d/99-synflood.conf\nsysctl --system\n\n# firewall: global SYN limit\niptables -A INPUT -p tcp --syn --dport 443 -m limit --limit 400/s --limit-burst 800 -j ACCEPT\niptables -A INPUT -p tcp --syn --dport 443 -j DROP' },
        { t: 'note', title: 'Test in a lab, never on someone else\'s network', x: 'Only generate flood traffic against systems you own or have written permission to test, and keep it inside an isolated virtual network. This workshop uses a simulated host so that you can practise the defences safely.' }
      ],
      results: {
        pass: 'Your hardening holds. The server stayed available for genuine customers while the attack continued.',
        weak: 'Customers are mostly getting through, but the server is still strained. Look at which layers you have not used yet.',
        fail: 'Customers are still being refused. Re-read the notes below and the checklist.',
        needCore: 'Finish the required checklist items first (or at least enable SYN cookies), then run the test.'
      }
    },

    // ------------------------------------------------------------------ 4. LAYERS
    layers: {
      brief: 'No single control stops every flood. Real networks stack several layers, and each layer solves a different problem. Read the layers, then decide which one is the right answer to each situation.',
      layers: [
        { id: 'host', name: 'Host kernel tuning', text: 'SYN cookies, backlog sizes, SYN-ACK retries. Free and fast to apply, but only protects the one machine, and it cannot help if the link itself is full.' },
        { id: 'firewall', name: 'Host or network firewall', text: 'Global SYN rate limits, per-source limits (connlimit, hashlimit), SYNPROXY. Removes bad traffic before the application sees it. A limit that is too low also blocks customers.' },
        { id: 'proxy', name: 'Load balancer or reverse proxy', text: 'Terminates TCP in front of the application. Only completed handshakes are forwarded, and the proxy tier can be scaled out. Needs capacity of its own.' },
        { id: 'scrubbing', name: 'Upstream scrubbing / CDN / DDoS protection service', text: 'Traffic is announced to a provider with huge capacity, cleaned, and forwarded to you. The only answer to attacks bigger than your uplink. Costs money and needs preparation.' },
        { id: 'isp', name: 'ISP or edge network (RTBH, FlowSpec, BCP 38)', text: 'Operators drop traffic at their edge: remote-triggered black-hole (RTBH) routes, FlowSpec filters, and ingress filtering that blocks forged source addresses at the origin.' }
      ],
      exercises: [
        {
          id: 'l1',
          situation: 'A flood of 2 Gbit/s of SYN packets is saturating your 1 Gbit/s uplink. Your server is healthy but cannot be reached.',
          answer: 'scrubbing',
          explanation: 'Packets never get through the saturated link, so nothing you configure on the server matters. Traffic has to be absorbed or cleaned upstream, by a provider with more capacity than the attack.'
        },
        {
          id: 'l2',
          situation: 'A modest spoofed flood (500 SYN/s) hits one Linux server. The link is idle but the SYN queue is full.',
          answer: 'host',
          explanation: 'This is exactly what SYN cookies and shorter SYN-ACK retries are for. It is cheap, immediate and needs no extra infrastructure.'
        },
        {
          id: 'l3',
          situation: 'You want your application servers to never see a half-open connection at all, and you want to add capacity for connection handling independently of the application.',
          answer: 'proxy',
          explanation: 'A load balancer or reverse proxy terminates the handshake itself and passes only established connections to the application tier.'
        },
        {
          id: 'l4',
          situation: 'Cookies are enabled and working, but the servers burn CPU filtering a continuous flood. You want to drop most of it cheaply before the application stack and keep legitimate traffic flowing.',
          answer: 'firewall',
          explanation: 'Stateless or SYNPROXY firewall rules and global SYN limits discard bad traffic early, at lower cost than letting each SYN reach the full TCP stack.'
        },
        {
          id: 'l5',
          situation: 'Your hosting network lets customers send packets with any source address, so attackers can use it to hide. How should the network operator stop being a source of spoofed floods?',
          answer: 'isp',
          explanation: 'Ingress filtering (BCP 38 / uRPF) at the network edge drops packets whose source address does not belong to the customer. It protects everybody else, not the operator itself.'
        },
        {
          id: 'l6',
          situation: 'One customer-facing IP address is being hit so hard that it threatens the whole data centre. You decide to sacrifice that one address to keep every other service up.',
          answer: 'isp',
          explanation: 'Remote-triggered black-holing (RTBH) tells upstream routers to discard all traffic to that address. It stops the collateral damage but also completes the attacker\'s goal for that address, so it is a last resort.'
        }
      ],
      closing: 'Good design is **defence in depth**: BCP 38 reduces spoofing everywhere, scrubbing covers volume, a proxy or firewall removes bad handshakes, and host tuning is the last line. Each layer has gaps, and the layers together cover them.'
    },

    // ------------------------------------------------------------------ 5. INCIDENT
    incident: {
      brief: 'It is 02:14. You are the incident commander for the shop. Make each call as you would in production. A weak choice is explained and you can try again, but your first-try score is recorded.',
      steps: [
        {
          id: 'n1',
          title: 'Triage',
          situation: 'The pager says customers see timeouts. Dashboards show low CPU and low bandwidth. What do you do first?',
          options: [
            { text: 'Reboot web01 straight away.', good: false, why: 'A reboot empties the queue for a few seconds, destroys the evidence in memory and logs, and the attack refills the table within a minute. It also hides the cause.' },
            { text: 'Confirm what is happening: check connection states, the kernel log and a short packet sample.', good: true, why: 'Correct. Establish whether this is an attack, a flash crowd or an application fault before changing anything. It takes two minutes and decides every later step.' },
            { text: 'Block every address from outside the country.', good: false, why: 'This is guesswork. Spoofed addresses make geography meaningless, and you would block real customers.' },
            { text: 'Post on social media that the site is under attack.', good: false, why: 'You have no confirmed diagnosis yet. Communicate once you know facts, through the planned channels.' }
          ]
        },
        {
          id: 'n2',
          title: 'Preserve evidence',
          situation: 'Evidence confirms a spoofed SYN flood (4,096 entries in SYN-RECV, "Possible SYN flooding" in the log). What should you save before changing the configuration?',
          options: [
            { text: 'Nothing, the logs rotate automatically.', good: false, why: 'Logs rotate and counters reset. Without a sample you cannot brief your provider or learn from the incident.' },
            { text: 'A short packet capture, the connection-state counts and kernel log lines, each with timestamps.', good: true, why: 'Correct. A few seconds of capture, the counters and timestamps are enough for the provider, for the post-incident review and for any later report.' },
            { text: 'A screenshot of the website.', good: false, why: 'The site is simply down. It tells nobody how or why.' },
            { text: 'Delete the old logs so the disk does not fill.', good: false, why: 'Deleting evidence in the middle of an incident is the opposite of what you need.' }
          ]
        },
        {
          id: 'n3',
          title: 'First containment',
          situation: 'What is the fastest safe change on the server itself?',
          options: [
            { text: 'sysctl -w net.ipv4.tcp_syncookies=1 (and shorten tcp_synack_retries).', good: true, why: 'Correct. It is applied instantly, needs no restart, is easy to reverse, and lets genuine clients through while the queue is full.' },
            { text: 'Set tcp_max_syn_backlog to 10,000,000.', good: false, why: 'A huge backlog only delays the problem and consumes memory for every forged entry. Without cookies it is just a bigger table to fill.' },
            { text: 'Disable TCP timestamps to save CPU.', good: false, why: 'SYN cookies use the timestamp field to carry option bits. Disabling it weakens exactly the defence you need.' },
            { text: 'Restart nginx.', good: false, why: 'The problem is in the kernel\'s SYN queue, not in nginx. Restarting breaks the few connections that do work.' }
          ]
        },
        {
          id: 'n4',
          title: 'Escalate',
          situation: 'Cookies are on and most customers recover, but the link is at 85% and rising. The host cannot fix a full link. What next?',
          options: [
            { text: 'Buy more RAM for web01.', good: false, why: 'Memory is not the bottleneck, bandwidth is. More RAM cannot widen the link.' },
            { text: 'Contact your upstream provider or DDoS protection service with the capture and ask to activate scrubbing or filtering.', good: true, why: 'Correct. Only an upstream with more capacity than the attack can absorb it. Your saved capture and timestamps make this call fast.' },
            { text: 'Add the source addresses in the capture to the firewall blocklist.', good: false, why: 'They are forged and change on every packet. You would add thousands of useless rules and risk blocking real people.' },
            { text: 'Wait and see if it stops.', good: false, why: 'Hoping is not a plan. Preparation and escalation matter most when the link is filling.' }
          ]
        },
        {
          id: 'n5',
          title: 'Communicate',
          situation: 'Customers and management are asking what is going on. How do you communicate?',
          options: [
            { text: 'A short status update: what customers see, since when, that you are working on it, and when the next update is due. Name one person as incident commander.', good: true, why: 'Correct. Factual, time-stamped and honest about what is known. A single owner avoids contradictory messages.' },
            { text: 'Say nothing until the incident is completely resolved.', good: false, why: 'Silence causes rumours and support tickets. Regular short updates reduce load on the team.' },
            { text: 'Blame a named competitor.', good: false, why: 'You have no evidence about who is behind it, and attribution mistakes are expensive.' },
            { text: 'Promise that the problem is fixed before you have verified it.', good: false, why: 'Premature all-clear messages destroy trust when the attack resumes.' }
          ]
        },
        {
          id: 'n6',
          title: 'Aftermath',
          situation: 'At 04:40 the attack stops. What should happen next?',
          options: [
            { text: 'Revert everything to defaults because the problem is gone.', good: false, why: 'The weakness that allowed the outage is still there. Reverting restores exactly the vulnerable configuration.' },
            { text: 'Make the fixes permanent, add alerts, update the runbook and hold a blameless review.', good: true, why: 'Correct. Persist the sysctl settings, alert on the SYN-RECV count and on the kernel "Possible SYN flooding" message, write down what worked, test the provider contact path, and review without blaming individuals.' },
            { text: 'Do nothing and go back to sleep.', good: false, why: 'Without follow-up the next attack repeats the same outage.' },
            { text: 'Disable monitoring to avoid false alarms.', good: false, why: 'Monitoring found the problem. Tuning alerts is right, switching them off is not.' }
          ]
        }
      ],
      debrief: 'A SYN flood is rarely stopped by one clever command. It is stopped by measuring first, applying reversible host fixes, escalating when the problem is bigger than the host, communicating clearly, and fixing the cause afterwards.'
    },

    // extra scenario questions appended to the final quiz
    quizExtra: [
      {
        id: 7,
        question: 'With the default tcp_synack_retries = 5, how long does a forged SYN occupy a slot in the SYN queue?',
        options: ['About 1 second', 'About 7 seconds', 'About 63 seconds', 'Until the next reboot'],
        answer: 2,
        explanation: 'The SYN-ACK is retransmitted after 1, 2, 4, 8 and 16 seconds and the entry is removed after one more wait of 32 seconds: 1+2+4+8+16+32 = 63 seconds.'
      },
      {
        id: 8,
        question: 'A flood arrives at 1,000 forged SYN per second and each entry lives for 7 seconds. About how many half-open entries does the server hold in steady state?',
        options: ['70', '700', '7,000', '70,000'],
        answer: 2,
        explanation: 'Little\'s law: entries = arrival rate x lifetime = 1,000 x 7 = 7,000.'
      },
      {
        id: 9,
        question: 'Why is a per-source-address rate limit a poor defence against a spoofed SYN flood?',
        options: [
          'Routers cannot count packets per address',
          'Every packet carries a different forged source address, so no single source ever exceeds the limit',
          'It only works for IPv6',
          'It always blocks the administrator'
        ],
        answer: 1,
        explanation: 'A per-source limit counts packets from one address. A spoofing attacker rotates through addresses, so each one stays under the limit. Global limits, cookies, SYNPROXY and upstream filtering do not depend on the source address.'
      },
      {
        id: 10,
        question: 'You run sysctl -w net.ipv4.tcp_syncookies=1 during an attack and the site recovers. What must you do to keep this after a reboot?',
        options: [
          'Nothing, sysctl -w is permanent',
          'Add the setting to a file in /etc/sysctl.d/ and load it with sysctl --system',
          'Reinstall the operating system',
          'Restart the network cable'
        ],
        answer: 1,
        explanation: 'sysctl -w modifies only the running kernel. A line in /etc/sysctl.d/*.conf is read at boot and by sysctl --system.'
      },
      {
        id: 11,
        question: 'An attack of 3 Gbit/s saturates your 1 Gbit/s link. Which action is most likely to restore service?',
        options: [
          'Enable SYN cookies on the server',
          'Increase tcp_max_syn_backlog',
          'Divert traffic through an upstream scrubbing service or ask the provider to filter',
          'Shorten tcp_synack_retries'
        ],
        answer: 2,
        explanation: 'The packets are lost before they reach the server, so host settings cannot help. Only a party with more capacity than the attack, such as a scrubbing service or the upstream provider, can absorb it.'
      },
      {
        id: 12,
        question: 'Which long-term network measure reduces the supply of spoofed floods across the whole internet?',
        options: [
          'Ingress filtering (BCP 38) that drops packets with source addresses the network does not own',
          'Longer passwords',
          'Disabling IPv6',
          'Using larger TCP window sizes'
        ],
        answer: 0,
        explanation: 'If every network dropped packets with forged source addresses at the edge, spoofed floods and reflection attacks would be far harder. BCP 38 (RFC 2827) describes how.'
      }
    ],

    completion: {
      title: "Defender's Workshop complete",
      message: 'You have measured an attack, proved its type from evidence, hardened a server with real commands, matched defences to problems, and led an incident. These are the same steps a practising security engineer takes.'
    }
  };

  // ---- housekeeping: spread the correct answers over A-D and append the extra quiz questions ----
  function balance(list, offset) {
    list.forEach(function (q, i) {
      var target = (i * 3 + offset) % 4, from = q.answer;
      if (from === target) return;
      var tmp = q.options[from]; q.options[from] = q.options[target]; q.options[target] = tmp;
      q.answer = target;
    });
  }
  var CMD = {
    synCookies: 'sysctl -w net.ipv4.tcp_syncookies=1',
    rateLimit: 'iptables -A INPUT -p tcp --syn --dport 443 -m limit --limit 400/s --limit-burst 800 -j ACCEPT\niptables -A INPUT -p tcp --syn --dport 443 -j DROP',
    shortTimeout: 'sysctl -w net.ipv4.tcp_synack_retries=2',
    firewall: 'sysctl -w net.netfilter.nf_conntrack_tcp_loose=0\niptables -t raw -A PREROUTING -p tcp -m tcp --syn --dport 443 -j CT --notrack\niptables -A INPUT -p tcp -m tcp --dport 443 -m conntrack --ctstate INVALID,UNTRACKED -j SYNPROXY --sack-perm --timestamp --wscale 7 --mss 1460'
  };
  Object.keys(CMD).forEach(function (k) { if (Lab.Content.mitigations[k]) Lab.Content.mitigations[k].command = CMD[k]; });

  // ---- the guided runbook shown inside the terminal pop-up (checked by js/terminal.js, in this order) ----
  Lab.Content.runbook = {
    title: 'Guided runbook',
    intro: 'Run these commands one at a time, as an on-call engineer would. Each step checks the server state, not just what you typed, so a different correct command also counts.',
    steps: [
      { id: 'count', check: 'count', required: true, title: 'Measure: count half-open connections',
        why: 'Never change a system you have not measured. SYN-RECV is the state of a connection that received a SYN and is waiting for the final ACK.',
        command: 'ss -tan state syn-recv | wc -l',
        learned: 'About 256 entries (the whole SYN queue) plus a header line. A healthy web server has only a handful in SYN-RECV at any moment.' },
      { id: 'klog', check: 'klog', required: true, title: 'Read the kernel log',
        why: 'The kernel reports a suspected SYN flood itself, and says whether it is dropping requests or sending cookies.',
        command: 'dmesg | tail',
        learned: 'The line "Possible SYN flooding on port 443. Dropping request" confirms the queue overflowed and the kernel has no way to keep serving new clients.' },
      { id: 'capture', check: 'capture', required: true, title: 'Capture attack packets as evidence',
        why: 'You need proof for the post-incident review and for your upstream provider. -c limits the capture to a few packets.',
        command: "tcpdump -nn -c 10 'tcp[tcpflags] == tcp-syn'",
        learned: 'Many SYN packets from unrelated addresses with identical window size: the signature of a tool forging source addresses.' },
      { id: 'readcookies', check: 'readcookies', required: true, title: 'Check whether SYN cookies are on',
        why: 'Before changing a setting, read its current value.',
        command: 'sysctl net.ipv4.tcp_syncookies',
        learned: 'The value is 0. Somebody disabled cookies "for performance", so a full queue means genuine customers are refused.' },
      { id: 'cookies', check: 'cookies', required: true, title: 'Mitigation 1: enable SYN cookies',
        why: 'With cookies, the kernel stops storing state for each SYN once the queue is full and still serves clients that complete the handshake.',
        command: 'sysctl -w net.ipv4.tcp_syncookies=1',
        learned: 'Applied instantly to the running kernel. The SYN cookies switch in the Mitigation section follows it.' },
      { id: 'retries', check: 'retries', required: true, title: 'Mitigation 2: expire half-open entries sooner',
        why: 'Entries live 2^(retries+1) - 1 seconds. With 5 retries that is 63 s. With 2 retries it is 7 s, so the same flood fills far less of the queue.',
        command: 'sysctl -w net.ipv4.tcp_synack_retries=2',
        learned: 'Forged entries now vanish after 7 seconds. Do not set it to 0: genuine clients on lossy links would fail.' },
      { id: 'rateAccept', check: 'rateAccept', required: true, title: 'Mitigation 3a: allow SYNs up to a global limit',
        why: 'The sources are forged, so a per-source limit is useless. This rule accepts new SYNs to port 443 up to 400 per second (your normal peak is about 150).',
        command: 'iptables -A INPUT -p tcp --syn --dport 443 -m limit --limit 400/s --limit-burst 800 -j ACCEPT',
        learned: 'On its own this changes nothing, because the default policy is ACCEPT. The next rule makes it a limit.' },
      { id: 'rateDrop', check: 'rateDrop', required: true, title: 'Mitigation 3b: drop SYNs above the limit',
        why: 'Rules are evaluated top to bottom. SYNs within the limit match the ACCEPT rule; everything else reaches this DROP rule.',
        command: 'iptables -A INPUT -p tcp --syn --dport 443 -j DROP',
        learned: 'A global SYN limit is now in force. It is blunt (it also drops customers during a flood) but keeps the TCP stack from being overwhelmed.' },
      { id: 'listRules', check: 'listRules', required: true, title: 'Verify the firewall rules',
        why: 'Always read back what you configured. Order matters.',
        command: 'iptables -S',
        learned: 'The ACCEPT-limit rule comes first, then the DROP rule. If they were the other way round, every SYN would be dropped.' },
      { id: 'persistCookies', check: 'persistCookies', required: true, title: 'Make it permanent: cookies',
        why: '`sysctl -w` changes only the running kernel. Settings in /etc/sysctl.d/ are read at boot.',
        command: 'echo "net.ipv4.tcp_syncookies = 1" >> /etc/sysctl.d/99-synflood.conf',
        learned: 'The setting is in the file but not loaded yet. Check it with cat /etc/sysctl.d/99-synflood.conf.' },
      { id: 'persistRetries', check: 'persistRetries', required: true, title: 'Make it permanent: SYN-ACK retries',
        why: 'Same file, second setting.',
        command: 'echo "net.ipv4.tcp_synack_retries = 2" >> /etc/sysctl.d/99-synflood.conf',
        learned: 'Both settings are now in the file. iptables rules are saved separately (for example with iptables-save or your distribution\'s persistence package).' },
      { id: 'load', check: 'load', required: true, title: 'Load the file and confirm it parses',
        why: 'Loading proves the file has no typos and that a reboot will give the same result.',
        command: 'sysctl --system',
        learned: 'sysctl applied every file under /etc/sysctl.d/. A typo here would show an error now instead of during an outage.' },
      { id: 'curl', check: 'curl', required: true, title: 'Verify from the customer\'s side',
        why: 'The real test is whether a customer request succeeds.',
        command: 'curl -I --max-time 5 https://shop.example/',
        learned: 'The request is served again. Press Run With Mitigation to measure the same attack against your configuration.' },
      { id: 'loose', check: 'loose', required: false, title: 'Bonus: SYNPROXY, strict conntrack',
        why: 'SYNPROXY lets the firewall complete the handshake for the server. It needs conntrack in strict mode so mid-stream packets are not accepted as new connections.',
        command: 'sysctl -w net.netfilter.nf_conntrack_tcp_loose=0',
        learned: 'Prerequisite one of three.' },
      { id: 'notrack', check: 'notrack', required: false, title: 'Bonus: do not track incoming SYNs',
        why: 'SYNs must bypass connection tracking so the proxy, not the server, answers them.',
        command: 'iptables -t raw -A PREROUTING -p tcp -m tcp --syn --dport 443 -j CT --notrack',
        learned: 'Prerequisite two of three.' },
      { id: 'synproxy', check: 'synproxy', required: false, title: 'Bonus: add the SYNPROXY rule',
        why: 'Untracked SYNs and invalid packets are handed to SYNPROXY, which only forwards connections that proved they are real.',
        command: 'iptables -A INPUT -p tcp -m tcp --dport 443 -m conntrack --ctstate INVALID,UNTRACKED -j SYNPROXY --sack-perm --timestamp --wscale 7 --mss 1460',
        learned: 'The firewall filter is now active: the Firewall filtering switch turns on.' }
    ],
    complete: 'Runbook complete. You measured, mitigated, persisted and verified. Now press Run With Mitigation to see the result against the same attack.'
  };

  var WK = Lab.Content.workshop;
  balance(WK.understand.checkpoints, 2);
  balance(WK.investigate.questions, 3);
  Lab.Content.quiz = Lab.Content.quiz.concat(WK.quizExtra);
  balance(Lab.Content.quiz, 1);
})(window.Lab);

/* ===== js/icons.js ===== */
/* ==========================================================================
   icons.js — OWNER: Sanika Lobo
   Purpose: inline SVG icon strings (Lab.Icons, CONTRACT §5.7).
   Six matching line icons: 24x24 viewBox, stroke="currentColor", 1.75 stroke,
   round caps and joins, aria-hidden, no external references.
   A complete first draft: feel free to redraw in Figma and replace the paths.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
             'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var CLOSE = '</svg>';
  function icon(body) { return OPEN + body + CLOSE; }

  Lab.Icons = {
    // laptop
    client: icon(
      '<rect x="4" y="5" width="16" height="11" rx="1.5"/>' +
      '<path d="M2 19h20"/>' +
      '<path d="M9 19l.5-3h5l.5 3"/>'
    ),

    // a box emitting arrows (traffic generator)
    generator: icon(
      '<rect x="3" y="8" width="9" height="9" rx="1.5"/>' +
      '<path d="M15 9h6"/><path d="M18.5 6.5L21 9l-2.5 2.5"/>' +
      '<path d="M15 14h6"/><path d="M18.5 11.5L21 14l-2.5 2.5"/>' +
      '<path d="M15 19h6"/><path d="M18.5 16.5L21 19l-2.5 2.5"/>'
    ),

    // rack server
    server: icon(
      '<rect x="3" y="4" width="18" height="6" rx="1.5"/>' +
      '<rect x="3" y="14" width="18" height="6" rx="1.5"/>' +
      '<path d="M7 7h.01"/><path d="M7 17h.01"/>' +
      '<path d="M12 7h6"/><path d="M12 17h6"/>'
    ),

    // stacked slots / inbox
    queue: icon(
      '<rect x="4" y="3.5" width="16" height="4" rx="1"/>' +
      '<rect x="4" y="10" width="16" height="4" rx="1"/>' +
      '<rect x="4" y="16.5" width="16" height="4" rx="1"/>' +
      '<path d="M8 5.5h5"/><path d="M8 12h5"/>'
    ),

    // signal / pulse
    status: icon(
      '<path d="M2 12h4l2.5-6 4 12 3-9 1.5 3H22"/>'
    ),

    // shield with a check (defence)
    shield: icon(
      '<path d="M12 3l7.5 2.7v5.6c0 4.4-3.1 8.2-7.5 9.7-4.4-1.5-7.5-5.3-7.5-9.7V5.7L12 3z"/>' +
      '<path d="M8.6 12l2.4 2.4 4.4-4.8"/>'
    )
  };
})(window.Lab);

/* ===== js/engine.js ===== */
/* ==========================================================================
   engine.js — OWNER: Manvith Karkera
   Purpose: the simulation model (Lab.Engine, CONTRACT §5.2-5.4).

   The server becomes unavailable BECAUSE the simulated half-open queue fills,
   never because code sets a label: every second ("tick") the engine moves real
   connection records through a queue and derives all metrics from it.

   Per tick, in this order (the cause-and-effect chain from CONTRACT §5.4):
     1. expire half-open entries whose timeout has passed
     2. generate arrivals (legitimate + attack) with the seeded PRNG
     3. apply the firewall, then the rate limit
     4. each surviving SYN takes a free slot; if the queue is full it becomes a
        stateless SYN cookie (when enabled) or is rejected
     5. legitimate handshakes that have run for 1 s complete and free their slot
     6. recompute metrics from the queue, derive the server state, emit events

   Everything numeric lives in DEFAULTS below. All numbers are simulated
   educational estimates, not benchmarks.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  // ---- tunable constants ---------------------------------------------------
  var DEFAULTS = {
    tickMs: 500,               // real time per tick; one tick = 1 simulated second
    seed: 1337,                // mulberry32 seed: same settings => same result
    capacity: 100,             // half-open slots. More capacity = a longer fight before the queue is full
    legitRate: 5,              // legitimate SYN/s
    legitHandshakeSec: 1,      // a legit client completes its handshake after 1 s, then frees its slot
    legitRetries: 1,           // a legit SYN rejected because the queue is full is retransmitted once (as real TCP does)
    retryDelaySec: 1,          //   after this many seconds. More retries = a flood hurts legit users less
    timeoutSec: 30,            // how long a half-open entry waits for the final ACK. Longer = attack slots stay occupied longer
    shortTimeoutSec: 5,        // "Shorter timeouts" defence: attack entries are dropped much sooner
    timeoutJitter: 0.5,        // timeouts vary +/-50% around timeoutSec (retransmit back-off, client differences), so expiries are spread out
    levels: {                  // attack strength: SYN/s and the share that NEVER sends the final ACK
      low:    { rate: 4,  incompleteFrac: 0.5 },
      medium: { rate: 15, incompleteFrac: 0.8 },
      high:   { rate: 50, incompleteFrac: 0.95 }
    },
    rateLimitPerSec: 8,        // rate limiting: at most this many generator SYNs/s are accepted, the rest are 'filtered'
    firewallAttackDrop: 0.7,   // firewall: share of attack SYNs dropped. Higher = fewer slots wasted
    firewallLegitDrop: 0.02,   // firewall: legitimate SYNs wrongly dropped (a defence is never free)
    cpuBase: 8,                // cpu = min(100, base + perPending*pending + perSyn*synIncoming + perCookie*cookies)
    cpuPerPending: 0.5,        // every half-open entry costs memory and bookkeeping
    cpuPerSyn: 0.3,            // every arriving SYN costs processing
    cpuPerCookie: 0.4,         // SYN cookies avoid slots but cost extra hashing
    respBaseMs: 40,            // response time = base + queue term + overload term
    respQueueMs: 1500,         //   queue term: respQueueMs * (queueUtil/100)^3  (grows sharply near full)
    respCpuMsPerPct: 6,        //   overload term: ms per cpu% above the knee
    cpuKnee: 60,
    availabilityWindow: 5,     // availability = legit success over the last N simulated seconds
    baselineSeconds: 20,
    attackSeconds: 40
  };

  var MITIGATION_KEYS = ['synCookies', 'rateLimit', 'shortTimeout', 'firewall'];
  var MITIGATION_LABELS = {
    synCookies: 'SYN cookies', rateLimit: 'rate limiting', shortTimeout: 'shorter timeouts', firewall: 'firewall filtering'
  };
  var MAX_PACKETS_PER_TICK = 12;
  var MAX_LEGIT_PACKETS = 4;       // keep the animation readable: legit traffic is never drowned out

  // ---- helpers -------------------------------------------------------------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function round1(n) { return Math.round(n * 10) / 10; }

  function mergeParams(overrides) {
    var p = clone(DEFAULTS);
    if (overrides) {
      Object.keys(overrides).forEach(function (k) {
        if (k === 'levels' && overrides.levels) {
          Object.keys(overrides.levels).forEach(function (l) { p.levels[l] = Object.assign({}, p.levels[l], overrides.levels[l]); });
        } else {
          p[k] = overrides[k];
        }
      });
    }
    return p;
  }

  function deriveServerState(m) {
    if (m.availability < 15) return 'Unavailable';
    if (m.availability < 70 || m.queueUtil > 95) return 'Degraded';
    if (m.availability < 95 || m.queueUtil >= 60 || m.cpu >= 70) return 'Under Pressure';
    return 'Healthy';
  }

  function create(overrides) {
    var params = mergeParams(overrides);
    var handlers = {};
    var timer = null;
    var rng = mulberry32(params.seed);
    var state, summary = null;

    // per-run bookkeeping (not part of State)
    var entries, retries, cohortAttempted, cohortOk, nextId, nextPacketId;
    var crossed, firstLegitRejected, effects, duration;

    function freshState() {
      return {
        t: 0, running: false, mode: 'idle', level: null,
        params: clone(params),
        mitigation: { synCookies: false, rateLimit: false, shortTimeout: false, firewall: false },
        queue: { capacity: params.capacity, legit: 0, attack: 0 },
        metrics: {
          synIncoming: 0, synTotal: 0, pending: 0,
          legitAttempted: 0, legitCompleted: 0,
          rejected: 0, timedOut: 0, filtered: 0,
          queueUtil: 0, cpu: 0, responseTimeMs: params.respBaseMs, availability: 100
        },
        serverState: 'Healthy',
        history: []
      };
    }

    function resetRunData() {
      entries = []; retries = []; cohortAttempted = {}; cohortOk = {}; nextId = 1; nextPacketId = 1;
      crossed = { 50: false, 90: false, 100: false };
      firstLegitRejected = false;
      effects = { cookies: 0, firewall: 0, rateLimit: 0, shortTimeout: 0 };
    }

    state = freshState();
    resetRunData();

    // ---- events ------------------------------------------------------------
    function emit(name, payload) {
      (handlers[name] || []).slice().forEach(function (h) {
        try { h(payload); } catch (e) { if (window.console) console.error('[Lab.Engine] handler for "' + name + '" threw:', e); }
      });
    }
    function log(level, message) { emit('log', { t: state.t, level: level, message: message }); }

    // ---- one simulated second ----------------------------------------------
    function step() {
      var m = state.metrics;
      var mit = state.mitigation;
      var t = ++state.t;
      var packets = { legit: [], attack: [] };   // candidates for animation

      // 1. expire timed-out half-open entries
      var kept = [], expired = 0;
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.expiresAt !== null && e.expiresAt <= t) {
          expired++;
          if (packets.attack.length < 40) packets.attack.push({ type: 'rst', source: e.source, outcome: 'timeout' });
        } else {
          kept.push(e);
        }
      }
      entries = kept;
      m.timedOut += expired;
      if (mit.shortTimeout) effects.shortTimeout += expired;

      // 2. generate arrivals (random order, so legit and attack SYNs compete for free slots fairly)
      var arrivals = [];
      var lvl = state.mode === 'attack' ? params.levels[state.level] : null;
      var legitCount = params.legitRate;
      for (i = 0; i < legitCount; i++) arrivals.push({ source: 'legit', cohort: t, retriesLeft: params.legitRetries });
      var due = [];
      retries = retries.filter(function (r) { if (r.due <= t) { due.push(r); return false; } return true; });
      due.forEach(function (r) { arrivals.push({ source: 'legit', cohort: r.cohort, retriesLeft: r.left }); });   // retransmitted SYNs
      if (lvl) for (i = 0; i < lvl.rate; i++) arrivals.push({ source: 'attack', incomplete: rng() < lvl.incompleteFrac });
      for (i = arrivals.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = arrivals[i]; arrivals[i] = arrivals[j]; arrivals[j] = tmp;
      }
      m.synIncoming = arrivals.length;
      m.synTotal += arrivals.length;
      m.legitAttempted += legitCount;                       // retries are not new attempts
      cohortAttempted[t] = legitCount;
      cohortOk[t] = 0;

      // 3 + 4. firewall, rate limit, then slot / cookie / reject
      var attackAccepted = 0, cookiesThisSecond = 0;
      for (i = 0; i < arrivals.length; i++) {
        var a = arrivals[i];
        var isAttack = a.source === 'attack';
        var outcome;

        if (mit.firewall && rng() < (isAttack ? params.firewallAttackDrop : params.firewallLegitDrop)) {
          outcome = 'filtered';
          if (isAttack) effects.firewall++;
        } else if (isAttack && mit.rateLimit && attackAccepted >= params.rateLimitPerSec) {
          outcome = 'filtered';
          effects.rateLimit++;
        } else {
          if (isAttack) attackAccepted++;
          if (entries.length < params.capacity) {
            var timeout = mit.shortTimeout ? params.shortTimeoutSec : params.timeoutSec;
            var spread = 1 + params.timeoutJitter * (rng() * 2 - 1);
            var entry = { id: nextId++, source: a.source, createdAt: t, expiresAt: null, completesAt: null, cohort: a.cohort };
            if (isAttack && a.incomplete) entry.expiresAt = t + Math.max(1, Math.round(timeout * spread));
            else entry.completesAt = t + params.legitHandshakeSec;
            entries.push(entry);
            outcome = 'queued';
          } else if (mit.synCookies) {
            // queue full: a stateless SYN-ACK costs CPU but no slot. Legit clients still finish the handshake.
            outcome = 'cookie';
            cookiesThisSecond++;
            effects.cookies++;
            if (!isAttack) { m.legitCompleted++; cohortOk[a.cohort]++; }
          } else {
            outcome = 'rejected';
            if (!isAttack && a.retriesLeft > 0) retries.push({ cohort: a.cohort, due: t + params.retryDelaySec, left: a.retriesLeft - 1 });
            if (!isAttack && !firstLegitRejected) {
              firstLegitRejected = true;
              log('danger', 'The queue is full: the first legitimate connection was just rejected');
            }
          }
        }

        if (outcome === 'filtered') m.filtered++;
        if (outcome === 'rejected') m.rejected++;
        // animation candidates: all attack SYNs, plus every legit SYN that did not simply queue
        if (isAttack) packets.attack.push({ type: 'syn', source: 'attack', outcome: outcome });
        else if (outcome !== 'queued') packets.legit.push({ type: 'syn', source: 'legit', outcome: outcome });
      }

      // 5. handshakes that have run long enough complete and free their slots
      kept = [];
      for (i = 0; i < entries.length; i++) {
        var en = entries[i];
        if (en.completesAt !== null && en.completesAt <= t) {
          if (en.source === 'legit') {
            m.legitCompleted++;
            cohortOk[en.cohort]++;
            packets.legit.push({ type: 'ack', source: 'legit', outcome: 'completed' });
          }
        } else {
          kept.push(en);
        }
      }
      entries = kept;

      // 6. metrics from the queue
      var legitIn = 0, attackIn = 0;
      for (i = 0; i < entries.length; i++) { if (entries[i].source === 'legit') legitIn++; else attackIn++; }
      state.queue.legit = legitIn;
      state.queue.attack = attackIn;
      m.pending = entries.length;
      m.queueUtil = round1(m.pending / params.capacity * 100);
      m.cpu = round1(Math.min(100, params.cpuBase + params.cpuPerPending * m.pending +
        params.cpuPerSyn * m.synIncoming + params.cpuPerCookie * cookiesThisSecond));
      m.responseTimeMs = Math.round(params.respBaseMs + params.respQueueMs * Math.pow(m.queueUtil / 100, 3) +
        params.respCpuMsPerPct * Math.max(0, m.cpu - params.cpuKnee));

      // availability: only fully resolved seconds count. A legit SYN may be retried once and then needs 1 s to
      // finish its handshake, so the window ends 2 s ago: [t-window-1 .. t-2].
      var att = 0, ok = 0;
      for (var w = t - params.availabilityWindow - 1; w <= t - 2; w++) {
        if (cohortAttempted[w]) { att += cohortAttempted[w]; ok += cohortOk[w]; }
      }
      m.availability = att === 0 ? 100 : round1(ok / att * 100);

      var from = state.serverState;
      state.serverState = deriveServerState(m);

      state.history.push({
        t: t, pending: m.pending, queueUtil: m.queueUtil, cpu: m.cpu,
        responseTimeMs: m.responseTimeMs, availability: m.availability
      });

      // events
      if (from !== state.serverState) {
        emit('serverStateChange', { from: from, to: state.serverState, t: t });
        log(state.serverState === 'Healthy' ? 'success' : (state.serverState === 'Unavailable' ? 'danger' : 'warn'),
          'Server state changed: ' + from + ' → ' + state.serverState);
      }
      [50, 90, 100].forEach(function (lvlPct) {
        var reached = lvlPct === 100 ? m.pending >= params.capacity : m.queueUtil >= lvlPct;
        if (reached && !crossed[lvlPct]) {
          crossed[lvlPct] = true;
          log(lvlPct === 100 ? 'danger' : 'warn', lvlPct === 100
            ? 'The connection queue is full (' + params.capacity + '/' + params.capacity + ')'
            : 'The connection queue passed ' + lvlPct + '% (' + m.pending + '/' + params.capacity + ')');
        }
      });
      if (t % 10 === 0) flushEffects();
      emitPackets(packets);
      emit('tick', clone(state));

      if (t >= duration) { finish(false); return false; }
      return true;
    }

    // Aggregate mitigation effects into occasional log lines (never a fixed script).
    function flushEffects() {
      if (effects.cookies) log('success', 'SYN cookies answered ' + effects.cookies + ' SYNs without using queue slots');
      if (effects.firewall) log('info', 'The firewall dropped ' + effects.firewall + ' attack SYNs before they reached the queue');
      if (effects.rateLimit) log('info', 'Rate limiting filtered ' + effects.rateLimit + ' excess SYNs from the traffic generator');
      if (effects.shortTimeout) log('info', 'Shorter timeouts freed ' + effects.shortTimeout + ' half-open slots early');
      effects = { cookies: 0, firewall: 0, rateLimit: 0, shortTimeout: 0 };
    }

    // At most 12 packets per tick, sampled between legit and attack so the animation never floods.
    function emitPackets(packets) {
      function pick(list, n) {
        var copy = list.slice(), out = [];
        while (copy.length && out.length < n) out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
        return out;
      }
      var legit = pick(packets.legit, MAX_LEGIT_PACKETS);
      var attack = pick(packets.attack, MAX_PACKETS_PER_TICK - legit.length);
      legit.concat(attack).forEach(function (p) {
        emit('packet', { id: nextPacketId++, type: p.type, source: p.source, outcome: p.outcome });
      });
    }

    // ---- run lifecycle -----------------------------------------------------
    function begin(mode, level, seconds, useTimer) {
      if (state.running) return false;                       // never two runs, never two timers
      var mitigation = state.mitigation;
      state = freshState();
      state.mitigation = mitigation;
      state.running = true;
      state.mode = mode;
      state.level = level;
      rng = mulberry32(params.seed);                        // same settings => identical numbers on every run
      resetRunData();
      duration = seconds;
      summary = null;

      var enabled = MITIGATION_KEYS.filter(function (k) { return mitigation[k]; }).map(function (k) { return MITIGATION_LABELS[k]; });
      var defence = enabled.length ? ' Defences on: ' + enabled.join(', ') + '.' : ' No defences enabled.';
      if (mode === 'baseline') {
        log('info', 'Baseline traffic started: ' + params.legitRate + ' legitimate SYN/s (simulated).' + defence);
      } else {
        var l = params.levels[level];
        log('warn', 'SYN flood started at ' + level + ' level: ' + l.rate + ' SYN/s, ' + Math.round(l.incompleteFrac * 100) +
          '% never complete (simulated).' + defence);
      }
      clearInterval(timer);
      timer = null;
      if (useTimer) timer = setInterval(step, params.tickMs);
      return true;
    }

    function finish(stoppedEarly) {
      clearInterval(timer);
      timer = null;
      if (!state.running) return;
      state.running = false;

      // handshakes already in flight finish rather than being cut off mid-way
      var m = state.metrics;
      entries.forEach(function (en) {
        if (en.source === 'legit' && en.completesAt !== null && en.completesAt <= state.t + params.legitHandshakeSec) {
          m.legitCompleted++;
          cohortOk[en.cohort]++;
          en.completesAt = state.t;
        }
      });
      flushEffects();

      var h = state.history, n = h.length;
      var sum = function (k) { return h.reduce(function (acc, r) { return acc + r[k]; }, 0); };
      summary = {
        mode: state.mode, level: state.level, mitigation: clone(state.mitigation),
        duration: state.t,
        peakPending: h.reduce(function (a, r) { return Math.max(a, r.pending); }, 0),
        avgQueueUtil: n ? round1(sum('queueUtil') / n) : 0,
        peakCpu: h.reduce(function (a, r) { return Math.max(a, r.cpu); }, 0),
        avgResponseTimeMs: n ? Math.round(sum('responseTimeMs') / n) : params.respBaseMs,
        legitSuccessRate: m.legitAttempted ? round1(m.legitCompleted / m.legitAttempted * 100) : 100,
        minAvailability: n ? h.reduce(function (a, r) { return Math.min(a, r.availability); }, 100) : 100,
        avgAvailability: n ? round1(sum('availability') / n) : 100,
        finalServerState: state.serverState,
        stoppedEarly: !!stoppedEarly
      };
      log('info', stoppedEarly
        ? 'Run stopped at t = ' + state.t + ' s. The state is kept so you can study it.'
        : 'Run finished after ' + state.t + ' simulated seconds.');
      emit('runEnded', clone(summary));
    }

    // ---- public API --------------------------------------------------------
    return {
      runBaseline: function () { begin('baseline', null, params.baselineSeconds, true); },
      runAttack: function (level) {
        if (!params.levels[level]) { if (window.console) console.warn('[Lab.Engine] unknown attack level:', level); return; }
        begin('attack', level, params.attackSeconds, true);
      },
      stop: function () { if (state.running) finish(true); },
      reset: function () {
        clearInterval(timer);
        timer = null;
        state = freshState();
        summary = null;
        rng = mulberry32(params.seed);
        resetRunData();
      },
      setMitigation: function (m) {
        if (state.running) { if (window.console) console.warn('[Lab.Engine] setMitigation ignored while a run is active'); return; }
        MITIGATION_KEYS.forEach(function (k) { if (m && typeof m[k] === 'boolean') state.mitigation[k] = m[k]; });
      },
      isRunning: function () { return state.running; },
      getState: function () { return clone(state); },
      getSummary: function () { return summary ? clone(summary) : null; },
      on: function (name, handler) {
        (handlers[name] = handlers[name] || []).push(handler);
        return function () { handlers[name] = (handlers[name] || []).filter(function (h) { return h !== handler; }); };
      },

      // test hooks (used by tests/engine.test.js): run without timers
      _beginForTests: function (mode, level) {
        return begin(mode, level, mode === 'baseline' ? params.baselineSeconds : params.attackSeconds, false);
      },
      _stepForTests: function () { return state.running ? step() : false; }
    };
  }

  Lab.Engine = { create: create, DEFAULTS: DEFAULTS };
})(window.Lab);

/* ===== js/visuals.js ===== */
/* ==========================================================================
   visuals.js — OWNER: Pranav Koradiya
   Purpose: network topology (SVG), packet animation, queue grid and the TCP
   handshake demo (Lab.Visuals, CONTRACT §5.8). Renders only: workflow.js wires
   the buttons. Uses only the engine's public API/events (CONTRACT §5.2).

   Animation logic in short:
   - Every engine 'packet' event becomes a small circle with a "plan": a list
     of legs (move to a point, take a CSS class, optionally fade out). The plan
     depends on the packet's outcome (completed / queued / rejected / filtered
     / cookie / timeout).
   - ONE shared requestAnimationFrame loop advances every packet; it stops
     itself when no packets are left. At most 60 packets exist at once (the
     oldest is dropped), nothing is spawned while the tab is hidden, and with
     prefers-reduced-motion no dots move at all (the queue grid, status node
     and dashboard still update).
   - Colours come from the CSS tokens via var(--...) presentation attributes,
     which have the lowest priority, so lab.css (Sanika) can restyle anything.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var MAX_PACKETS = 60;
  var LEG_MS = 320;       // time to travel one leg
  var FADE_MS = 360;      // time for a fading leg
  var GRID_COLS = 10;
  var SLOT = 10;
  var PITCH = 12;

  // Positions inside the 800x360 viewBox of #topology-svg.
  var NODES = {
    client:    { x: 110, y: 90,  lines: ['Legitimate', 'Client'],           cls: 'node--client' },
    generator: { x: 110, y: 270, lines: ['Simulated Traffic', 'Generator'], cls: 'node--generator' },
    server:    { x: 400, y: 180, lines: ['Target', 'Server'],               cls: 'node--server' },
    queue:     { x: 650, y: 180, lines: ['TCP Connection', 'Queue'],       cls: 'node--queue' },
    status:    { x: 400, y: 322, lines: ['Network Status'],                 cls: 'node--status' }
  };
  var QUEUE_BOX = { w: 180, h: 236 };

  // Fallback colours (var() presentation attributes lose to any stylesheet rule).
  var PACKET_FILL = {
    'packet--legit': 'var(--color-legit)', 'packet--attack': 'var(--color-attack)',
    'packet--synack': 'var(--color-pending)', 'packet--ack': 'var(--color-completed)',
    'packet--rejected': 'var(--color-rejected)', 'packet--filtered': 'var(--color-rejected)',
    'packet--cookie': 'var(--color-primary)'
  };
  var SLOT_STYLE = {
    free:   { fill: 'var(--color-surface-2)', stroke: 'var(--color-border)' },
    legit:  { fill: 'var(--color-legit)',     stroke: 'var(--color-legit)' },
    attack: { fill: 'var(--color-attack)',    stroke: 'var(--color-attack)' }
  };
  var STATE_CLASS = {
    'Healthy': 'healthy', 'Under Pressure': 'pressure', 'Degraded': 'degraded', 'Unavailable': 'unavailable'
  };
  var STATE_FILL = {
    'Healthy': 'var(--color-healthy)', 'Under Pressure': 'var(--color-pressure)',
    'Degraded': 'var(--color-degraded)', 'Unavailable': 'var(--color-unavailable)'
  };

  // ---- private state -------------------------------------------------------
  var svg = null, packetLayer = null, queueLabel = null, statusText = null, statusRect = null, statusNode = null;
  var slots = [], slotKinds = [], capacity = 100;
  var selectedKey = null;
  var nodeEls = {};
  var packets = [];
  var rafId = 0;
  var unsubs = [];
  var demo = null;        // handshake demo DOM + animation state
  var observer = null;
  var visibilityBound = false;

  // ---- helpers -------------------------------------------------------------
  function make(name, attrs, parent) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function lerp(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }

  function setClass(el, cls, fillMap) {
    el.setAttribute('class', cls);
    if (fillMap) {
      var parts = cls.split(' ');
      for (var i = 0; i < parts.length; i++) if (fillMap[parts[i]]) el.setAttribute('fill', fillMap[parts[i]]);
    }
  }

  // ---- topology ------------------------------------------------------------
  function buildNode(key, parent) {
    var def = NODES[key];
    var isQueue = key === 'queue';
    var w = isQueue ? QUEUE_BOX.w : 160;
    var h = isQueue ? QUEUE_BOX.h : 60;
    var g = make('g', {
      'class': 'node ' + def.cls, transform: 'translate(' + def.x + ',' + def.y + ')',
      tabindex: '0', role: 'button', 'aria-pressed': 'false', 'data-node': key,
      'aria-label': def.lines.join(' ')
    }, parent);
    var rect = make('rect', {
      x: -w / 2, y: -h / 2, width: w, height: h, rx: 10,
      fill: 'var(--color-surface)', stroke: 'var(--color-border)', 'stroke-width': 2
    }, g);
    rect.setAttribute('class', 'node__box');

    var icon = Lab.Icons && Lab.Icons[key === 'status' ? 'status' : key];
    var hasIcon = typeof icon === 'string' && icon.length > 0;
    var textFont = { 'font-size': 13, 'font-family': 'var(--font-sans)', fill: 'var(--color-text)' };
    var i, t;

    if (isQueue) {
      // Title + icon at the top, 10x10 slot grid in the middle, "pending / capacity" at the bottom.
      var top = -h / 2;
      if (hasIcon) placeIcon(g, icon, -10, top + 8, 20);
      for (i = 0; i < def.lines.length; i++) {
        t = make('text', textFont, g);
        t.setAttribute('text-anchor', 'middle'); t.setAttribute('x', 0);
        t.setAttribute('y', top + 46 + i * 16); t.textContent = def.lines[i];
      }
      var rows = Math.ceil(capacity / GRID_COLS);
      var gridW = GRID_COLS * PITCH - (PITCH - SLOT);
      var gx = -gridW / 2, gy = top + 72;
      var grid = make('g', { 'class': 'queue-grid' }, g);
      slots = []; slotKinds = [];
      for (i = 0; i < capacity; i++) {
        var s = make('rect', {
          x: gx + (i % GRID_COLS) * PITCH, y: gy + Math.floor(i / GRID_COLS) * PITCH,
          width: SLOT, height: SLOT, rx: 2, 'stroke-width': 1
        }, grid);
        paintSlot(s, 'free');
        slots.push(s); slotKinds.push('free');
      }
      queueLabel = make('text', textFont, g);
      queueLabel.setAttribute('text-anchor', 'middle'); queueLabel.setAttribute('x', 0);
      queueLabel.setAttribute('y', gy + rows * PITCH + 22);
      queueLabel.setAttribute('font-family', 'var(--font-mono)');
      queueLabel.textContent = '0 / ' + capacity + ' pending';
    } else {
      if (hasIcon) placeIcon(g, icon, -70, -14, 28);
      for (i = 0; i < def.lines.length; i++) {
        t = make('text', textFont, g);
        var oneLine = def.lines.length === 1;
        t.setAttribute('x', hasIcon ? -34 : 0);
        t.setAttribute('text-anchor', hasIcon ? 'start' : 'middle');
        t.setAttribute('y', oneLine ? 0 : -3 + i * 16);
        t.setAttribute('dominant-baseline', oneLine ? 'middle' : 'auto');
        t.textContent = def.lines[i];
      }
      if (key === 'status') {
        // Status node: label on top, current server state (text + colour) below it.
        statusRect = rect;
        statusNode = g;
        for (i = g.childNodes.length - 1; i >= 0; i--) {
          if (g.childNodes[i].nodeName === 'text') g.removeChild(g.childNodes[i]);
        }
        t = make('text', { 'font-size': 11, 'font-family': 'var(--font-sans)', fill: 'var(--color-muted)' }, g);
        t.setAttribute('text-anchor', 'middle'); t.setAttribute('x', 0); t.setAttribute('y', -8);
        t.textContent = 'Network Status';
        statusText = make('text', { 'font-size': 15, 'font-weight': 700, 'font-family': 'var(--font-sans)', fill: 'var(--color-text)' }, g);
        statusText.setAttribute('text-anchor', 'middle'); statusText.setAttribute('x', 0); statusText.setAttribute('y', 14);
        setStatus('Healthy');
      }
    }

    g.addEventListener('click', function () { toggleSelect(key); });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggleSelect(key); }
    });
    nodeEls[key] = { g: g, rect: rect };
    return g;
  }

  // Lab.Icons values are inline SVG strings; nest each one and size it.
  function placeIcon(g, iconString, x, y, size) {
    var holder = make('g', { 'class': 'node__icon', 'color': 'var(--color-text)' }, g);
    holder.innerHTML = iconString;
    var inner = holder.firstElementChild;
    if (inner && inner.nodeName.toLowerCase() === 'svg') {
      inner.setAttribute('x', x); inner.setAttribute('y', y);
      inner.setAttribute('width', size); inner.setAttribute('height', size);
    }
  }

  function buildTopology() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    nodeEls = {};
    var linksLayer = make('g', { 'class': 'links' }, svg);
    var pairs = [['client', 'server'], ['generator', 'server'], ['server', 'queue'], ['server', 'status']];
    pairs.forEach(function (p) {
      make('line', {
        'class': 'link', x1: NODES[p[0]].x, y1: NODES[p[0]].y, x2: NODES[p[1]].x, y2: NODES[p[1]].y,
        stroke: 'var(--color-border)', 'stroke-width': 3
      }, linksLayer);
    });
    // Packets sit between the links and the nodes so they appear to emerge from / enter the nodes.
    packetLayer = make('g', { 'class': 'packets', 'aria-hidden': 'true' }, svg);
    var nodesLayer = make('g', { 'class': 'nodes' }, svg);
    ['client', 'generator', 'server', 'queue', 'status'].forEach(function (k) { buildNode(k, nodesLayer); });
  }

  function paintSlot(rect, kind) {
    rect.setAttribute('class', 'queue-slot queue-slot--' + kind);
    rect.setAttribute('fill', SLOT_STYLE[kind].fill);
    rect.setAttribute('stroke', SLOT_STYLE[kind].stroke);
  }

  function toggleSelect(key) {
    var info = document.getElementById('component-info');
    var previous = selectedKey;
    clearSelection();
    if (previous === key) return;            // clicking the selected node again deselects it
    selectedKey = key;
    var n = nodeEls[key];
    if (n) {
      n.g.classList.add('is-selected');
      n.g.setAttribute('aria-pressed', 'true');
      n.rect.setAttribute('stroke', 'var(--color-focus)');
      n.rect.setAttribute('stroke-width', 4);
    }
    var data = Lab.Content && Lab.Content.components && Lab.Content.components[key];
    if (info && data) {
      info.textContent = '';
      var title = document.createElement('strong');
      title.textContent = data.title;
      var text = document.createElement('p');
      text.textContent = data.text;
      info.appendChild(title);
      info.appendChild(text);
    }
  }

  function clearSelection() {
    if (selectedKey && nodeEls[selectedKey]) {
      var n = nodeEls[selectedKey];
      n.g.classList.remove('is-selected');
      n.g.setAttribute('aria-pressed', 'false');
      n.rect.setAttribute('stroke', 'var(--color-border)');
      n.rect.setAttribute('stroke-width', 2);
    }
    selectedKey = null;
    var info = document.getElementById('component-info');
    if (info) info.textContent = '';
  }

  function setStatus(serverState) {
    if (!statusText) return;
    statusText.textContent = serverState;
    var cls = STATE_CLASS[serverState] || 'healthy';
    statusNode.setAttribute('class', 'node node--status server-badge--' + cls);
    statusNode.setAttribute('data-state', cls);
    statusRect.setAttribute('fill', 'var(--color-surface)');
    statusRect.setAttribute('stroke', STATE_FILL[serverState] || 'var(--color-border)');
    statusRect.setAttribute('stroke-width', 4);
  }

  // ---- queue grid ----------------------------------------------------------
  function updateQueue(state) {
    if (!slots.length || !state) return;
    var legit = Math.max(0, Math.round(state.queue.legit));
    var attack = Math.max(0, Math.round(state.queue.attack));
    for (var i = 0; i < slots.length; i++) {
      var kind = i < legit ? 'legit' : (i < legit + attack ? 'attack' : 'free');
      if (slotKinds[i] !== kind) { slotKinds[i] = kind; paintSlot(slots[i], kind); }
    }
    if (queueLabel) queueLabel.textContent = state.metrics.pending + ' / ' + state.queue.capacity + ' pending';
  }

  function emptyQueue() {
    for (var i = 0; i < slots.length; i++) {
      if (slotKinds[i] !== 'free') { slotKinds[i] = 'free'; paintSlot(slots[i], 'free'); }
    }
    if (queueLabel) queueLabel.textContent = '0 / ' + capacity + ' pending';
  }

  // ---- packets -------------------------------------------------------------
  // A plan is a list of legs: { to: {x,y}, cls, dur, fade }. Each leg starts where the previous ended.
  function planFor(source, outcome) {
    var src = source === 'attack' ? NODES.generator : NODES.client;
    var srv = NODES.server;
    var base = source === 'attack' ? 'packet--attack' : 'packet--legit';
    switch (outcome) {
      case 'completed':  // SYN -> server, SYN-ACK back to the client, ACK to the server
        return { from: src, legs: [
          { to: srv, cls: base, dur: LEG_MS },
          { to: src, cls: 'packet--synack', dur: LEG_MS },
          { to: srv, cls: 'packet--ack', dur: LEG_MS }] };
      case 'queued':     // attack: SYN-ACK goes out and fades, no ACK ever returns; legit: waits in the queue
        if (source === 'attack') {
          return { from: src, legs: [
            { to: srv, cls: base, dur: LEG_MS },
            { to: lerp(srv, src, 0.7), cls: 'packet--synack', dur: FADE_MS + 200, fade: true }] };
        }
        return { from: src, legs: [{ to: srv, cls: base, dur: LEG_MS }] };
      case 'rejected':   // arrives, turns grey and bounces back
        return { from: src, legs: [
          { to: srv, cls: base, dur: LEG_MS },
          { to: lerp(srv, src, 0.35), cls: 'packet--rejected', dur: FADE_MS + 100, fade: true }] };
      case 'filtered':   // dropped on the link
        return { from: src, legs: [
          { to: lerp(src, srv, 0.5), cls: base, dur: LEG_MS },
          { to: lerp(src, srv, 0.5), cls: 'packet--filtered', dur: FADE_MS, fade: true }] };
      case 'cookie':     // stateless SYN-ACK; legit clients still complete the handshake
        return { from: src, legs: [
          { to: srv, cls: base, dur: LEG_MS },
          source === 'attack'
            ? { to: lerp(srv, src, 0.7), cls: 'packet--cookie', dur: FADE_MS + 200, fade: true }
            : { to: src, cls: 'packet--cookie', dur: LEG_MS }] };
      case 'timeout':    // a half-open entry expiring at the server
        return { from: srv, legs: [{ to: srv, cls: 'packet--rejected', dur: FADE_MS, fade: true }] };
      default:
        return { from: src, legs: [{ to: srv, cls: base, dur: LEG_MS }] };
    }
  }

  function spawnPacket(evt) {
    if (!packetLayer || !evt || document.hidden || reducedMotion()) return;
    while (packets.length >= MAX_PACKETS) removePacket(0);
    var plan = planFor(evt.source, evt.outcome);
    var dot = make('circle', { r: 6, cx: plan.from.x, cy: plan.from.y, 'class': 'packet' }, packetLayer);
    var total = 0;
    plan.legs.forEach(function (l) { total += l.dur; });
    packets.push({ el: dot, plan: plan, start: performance.now(), total: total, cls: null });
    if (!rafId) rafId = requestAnimationFrame(frame);
  }

  function removePacket(index) {
    var p = packets.splice(index, 1)[0];
    if (p && p.el.parentNode) p.el.parentNode.removeChild(p.el);
  }

  function frame(now) {
    rafId = 0;
    for (var i = packets.length - 1; i >= 0; i--) {
      var p = packets[i];
      var elapsed = now - p.start;
      if (elapsed >= p.total) { removePacket(i); continue; }
      // find the current leg
      var from = p.plan.from, acc = 0, leg = null, legStart = from;
      for (var j = 0; j < p.plan.legs.length; j++) {
        leg = p.plan.legs[j];
        if (elapsed < acc + leg.dur) break;
        acc += leg.dur; legStart = leg.to;
      }
      var progress = Math.min(1, (elapsed - acc) / leg.dur);
      var pos = lerp(legStart, leg.to, progress);
      p.el.setAttribute('cx', pos.x.toFixed(1));
      p.el.setAttribute('cy', pos.y.toFixed(1));
      var cls = 'packet ' + leg.cls;
      if (p.cls !== cls) { p.cls = cls; setClass(p.el, cls, PACKET_FILL); }
      p.el.setAttribute('opacity', leg.fade ? (1 - progress).toFixed(2) : '1');
    }
    if (packets.length) rafId = requestAnimationFrame(frame);
  }

  function clearPackets() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    while (packets.length) removePacket(0);
    if (packetLayer) while (packetLayer.firstChild) packetLayer.removeChild(packetLayer.firstChild);
  }

  // ---- handshake demo ------------------------------------------------------
  var DEMO_STEP_MS = 1700;
  var DEMO_MOVE_MS = 900;
  // The dot travels between the two node edges (x = 112 and x = 308) so it never sits on top of a label.
  var DEMO_STEPS = [
    { from: 112, to: 308, cls: 'packet--legit',  name: 'SYN' },
    { from: 308, to: 112, cls: 'packet--synack', name: 'SYN-ACK' },
    { from: 112, to: 308, cls: 'packet--ack',    name: 'ACK' }
  ];

  function ensureDemo() {
    var host = document.getElementById('handshake-demo');
    if (!host) return null;
    if (demo && demo.host === host && host.contains(demo.svg)) return demo;
    host.textContent = '';
    var s = make('svg', { viewBox: '0 0 420 176', role: 'img', 'aria-label': 'Client and server exchanging SYN, SYN-ACK and ACK' });
    s.style.width = '100%'; s.style.display = 'block';
    make('line', { x1: 112, y1: 66, x2: 308, y2: 66, stroke: 'var(--color-border)', 'stroke-width': 3, 'stroke-linecap': 'round', 'class': 'link' }, s);
    [{ x: 70, label: 'Client', icon: 'client' }, { x: 350, label: 'Server', icon: 'server' }].forEach(function (n) {
      make('rect', { x: n.x - 42, y: 26, width: 84, height: 82, rx: 12, fill: 'var(--color-surface)', stroke: 'var(--color-border)', 'stroke-width': 2, 'class': 'handshake-node' }, s);
      var iconString = Lab.Icons && Lab.Icons[n.icon];
      if (iconString) placeIcon(s, iconString, n.x - 15, 36, 30);
      var t = make('text', { x: n.x, y: 98, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 600, 'font-family': 'var(--font-sans)', fill: 'var(--color-text)' }, s);
      t.textContent = n.label;
    });
    var dot = make('circle', { r: 9, cx: 112, cy: 66, opacity: 0, 'class': 'packet' }, s);
    var tag = make('text', { x: 112, y: 46, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, 'font-family': 'var(--font-mono)', fill: 'var(--color-text)', opacity: 0 }, s);
    var done = make('text', { x: 210, y: 140, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, 'font-family': 'var(--font-sans)', fill: 'var(--color-healthy)', opacity: 0 }, s);
    done.textContent = '\u2713 Connection established';
    var caption = document.createElement('p');
    caption.setAttribute('role', 'status');
    caption.className = 'handshake-caption';
    host.appendChild(s);
    host.appendChild(caption);
    demo = { host: host, svg: s, dot: dot, tag: tag, done: done, caption: caption, raf: 0, shownStep: -1 };
    return demo;
  }

  function cancelDemo() {
    if (demo && demo.raf) { cancelAnimationFrame(demo.raf); demo.raf = 0; }
  }

  function captionFor(i) {
    var h = Lab.Content && Lab.Content.theory && Lab.Content.theory.handshake && Lab.Content.theory.handshake[i];
    return h ? h.name + ': ' + h.text : DEMO_STEPS[i].name;
  }

  function playHandshakeDemo() {
    var d = ensureDemo();
    if (!d) return;
    cancelDemo();
    d.shownStep = -1;
    d.done.setAttribute('opacity', 0);
    d.dot.setAttribute('opacity', 0);
    d.tag.setAttribute('opacity', 0);
    d.caption.textContent = '';
    var still = reducedMotion();
    var started = 0;
    function tick(now) {
      if (!started) started = now;
      var elapsed = now - started;
      var step = Math.floor(elapsed / DEMO_STEP_MS);
      if (step >= DEMO_STEPS.length) {
        d.dot.setAttribute('opacity', 0);
        d.tag.setAttribute('opacity', 0);
        d.done.setAttribute('opacity', 1);
        d.caption.textContent = 'Connection established';
        d.raf = 0;
        return;
      }
      var s = DEMO_STEPS[step];
      if (d.shownStep !== step) {
        d.shownStep = step;
        setClass(d.dot, 'packet ' + s.cls, PACKET_FILL);
        d.tag.textContent = s.name;
        d.caption.textContent = captionFor(step);
        d.dot.setAttribute('opacity', 1);
        d.tag.setAttribute('opacity', 1);
      }
      var within = elapsed - step * DEMO_STEP_MS;
      var p = still ? 1 : Math.min(1, within / DEMO_MOVE_MS);   // reduced motion: jump straight to the end
      var x = s.from + (s.to - s.from) * p;
      d.dot.setAttribute('cx', x.toFixed(1));
      d.tag.setAttribute('x', x.toFixed(1));
      d.raf = requestAnimationFrame(tick);
    }
    d.raf = requestAnimationFrame(tick);
  }

  // ---- public API ----------------------------------------------------------
  Lab.Visuals = {
    init: function (engine) {
      unsubs.forEach(function (u) { u(); });
      unsubs = [];
      clearPackets();
      selectedKey = null;
      slots = []; slotKinds = [];

      svg = document.getElementById('topology-svg');
      if (svg) {
        var initial = engine && engine.getState ? engine.getState() : null;
        capacity = (initial && initial.queue && initial.queue.capacity) || 100;
        buildTopology();
        if (initial) { updateQueue(initial); setStatus(initial.serverState); }
        if (engine && engine.on) {
          unsubs.push(engine.on('tick', function (state) { updateQueue(state); setStatus(state.serverState); }));
          unsubs.push(engine.on('packet', spawnPacket));
          unsubs.push(engine.on('serverStateChange', function (e) { setStatus(e.to); }));
        }
      }

      if (!visibilityBound) {
        visibilityBound = true;
        document.addEventListener('visibilitychange', function () { if (document.hidden) clearPackets(); });
      }

      // Draw the handshake diagram now; auto-play it once, the first time it scrolls into view.
      if (ensureDemo() && 'IntersectionObserver' in window) {
        if (observer) observer.disconnect();
        observer = new IntersectionObserver(function (entries) {
          if (entries.some(function (en) { return en.isIntersecting; })) {
            observer.disconnect();
            observer = null;
            playHandshakeDemo();
          }
        });
        observer.observe(document.getElementById('handshake-demo'));
      }
    },

    playHandshakeDemo: playHandshakeDemo,

    reset: function () {
      clearPackets();
      cancelDemo();
      if (demo) { demo.dot.setAttribute('opacity', 0); demo.tag.setAttribute('opacity', 0); demo.done.setAttribute('opacity', 0); demo.caption.textContent = ''; }
      emptyQueue();
      setStatus('Healthy');
      clearSelection();
    }
  };
})(window.Lab);

/* ===== js/dashboard.js ===== */
/* ==========================================================================
   dashboard.js — OWNER: Pranav Koradiya
   Purpose: live metric cards, server-state badge, history chart, toasts,
   experiment log and the comparison table (Lab.Dashboard and Lab.Log,
   CONTRACT §5.8). Renders only: workflow.js wires the buttons.

   Important logic:
   - Engine 'tick' stores the newest State; ONE requestAnimationFrame paint
     per frame updates the cards, badge and chart, so a tick never causes
     more than one paint no matter how many events arrive.
   - Only #notifications is aria-live; cards, badge and chart are not, so
     screen readers are not flooded every simulated second.
   - The chart uses the plain 2D canvas API, reads its colours from the CSS
     tokens (getComputedStyle) on every draw so dark mode just works, and is
     scaled by devicePixelRatio so it stays crisp on high-DPI screens.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var STATE_CLASS = {
    'Healthy': 'healthy', 'Under Pressure': 'pressure', 'Degraded': 'degraded', 'Unavailable': 'unavailable'
  };
  var LEVEL_WORD = { info: 'Info', success: 'Success', warn: 'Warning', danger: 'Danger' };
  var MITIGATION_NAMES = {
    synCookies: 'SYN cookies', rateLimit: 'rate limiting', shortTimeout: 'shorter timeouts', firewall: 'firewall filtering'
  };
  var MAX_LOG_ENTRIES = 300;
  var MAX_TOASTS = 3;
  var TOAST_MS = 6000;

  var engineRef = null;
  var unsubs = [];
  var latest = null;          // newest State from the engine
  var paintQueued = false;
  var resizeBound = false;
  var chartSize = { w: 0, h: 0, dpr: 0 };

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return Number(n).toLocaleString(); }
  function pct(n) { return fmt(Math.round(n)) + '%'; }

  function getCapacity() {
    if (latest && latest.queue) return latest.queue.capacity;
    if (engineRef) return engineRef.getState().queue.capacity;
    return 100;
  }

  // ---- metric cards --------------------------------------------------------
  function card(metric) { return document.querySelector('[data-metric="' + metric + '"]'); }

  function setCard(metric, text, barPercent) {
    var c = card(metric);
    if (!c) return;
    var value = c.querySelector('.metric__value');
    if (value) value.textContent = text;
    if (barPercent !== undefined) {
      var bar = c.querySelector('.progress__bar');
      var track = c.querySelector('.progress');
      var clamped = Math.max(0, Math.min(100, barPercent));
      if (bar) bar.style.width = clamped + '%';
      if (track) track.setAttribute('aria-valuenow', Math.round(clamped));
    }
  }

  // Give each progress track proper semantics once (not live, so it is not announced every tick).
  function initProgressSemantics() {
    var cards = document.querySelectorAll('[data-metric]');
    for (var i = 0; i < cards.length; i++) {
      var track = cards[i].querySelector('.progress');
      var label = cards[i].querySelector('.metric__label');
      if (!track) continue;
      track.setAttribute('role', 'progressbar');
      track.setAttribute('aria-valuemin', '0');
      track.setAttribute('aria-valuemax', '100');
      track.setAttribute('aria-valuenow', '0');
      if (label) track.setAttribute('aria-label', label.textContent);
    }
  }

  function renderCards(state) {
    var m = state.metrics;
    setCard('syn-incoming', fmt(m.synIncoming));
    setCard('pending', fmt(m.pending) + ' / ' + fmt(state.queue.capacity));
    setCard('completed', fmt(m.legitCompleted));
    setCard('rejected', fmt(m.rejected + m.timedOut));
    setCard('queue-util', pct(m.queueUtil), m.queueUtil);
    setCard('cpu', pct(m.cpu), m.cpu);
    setCard('response-time', fmt(Math.round(m.responseTimeMs)));
    setCard('availability', pct(m.availability), m.availability);
  }

  function renderBadge(serverState) {
    var el = $('server-state');
    if (!el) return;
    var cls = STATE_CLASS[serverState] || 'healthy';
    el.className = 'server-badge server-badge--' + cls;
    el.setAttribute('data-state', cls);
    var explanation = Lab.Content && Lab.Content.serverStates && Lab.Content.serverStates[serverState];
    el.textContent = '';
    var name = document.createElement('span');
    name.className = 'server-state__name';
    name.textContent = 'Server: ' + serverState;
    el.appendChild(name);
    if (explanation) {
      var desc = document.createElement('span');
      desc.className = 'server-state__desc';
      desc.textContent = ' — ' + explanation;
      el.appendChild(desc);
    }
  }

  // ---- paint scheduling ----------------------------------------------------
  function paintNow() {
    if (!paintQueued) return;                 // already painted by the other trigger below
    paintQueued = false;
    if (!latest) return;
    renderCards(latest);
    renderBadge(latest.serverState);
    drawChart();
  }

  // One paint per frame. requestAnimationFrame is paused in background tabs, so a short timeout is the
  // fallback: whichever fires first paints, the other finds nothing to do.
  function schedulePaint() {
    if (paintQueued) return;
    paintQueued = true;
    requestAnimationFrame(paintNow);
    setTimeout(paintNow, 100);
  }

  // ---- chart ---------------------------------------------------------------
  function cssVar(styles, name, fallback) {
    var v = styles.getPropertyValue(name);
    return v && v.trim() ? v.trim() : fallback;
  }

  function drawChart() {
    var canvas = $('chart-history');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.style.width = '100%';
    canvas.style.maxWidth = '100%';
    canvas.style.display = 'block';
    var dpr = window.devicePixelRatio || 1;
    var cssW = Math.max(260, Math.round(canvas.clientWidth || 800));
    var cssH = Math.max(190, Math.min(300, Math.round(cssW * 0.32)));
    if (chartSize.w !== cssW || chartSize.h !== cssH || chartSize.dpr !== dpr) {
      chartSize = { w: cssW, h: cssH, dpr: dpr };
      canvas.style.height = cssH + 'px';
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    var styles = getComputedStyle(document.documentElement);
    var cText = cssVar(styles, '--color-text', '#1b2430');
    var cMuted = cssVar(styles, '--color-muted', '#5b6675');
    var cGrid = cssVar(styles, '--color-border', '#d5dbe3');
    var cAvail = cssVar(styles, '--color-healthy', '#12804f');
    var cQueue = cssVar(styles, '--color-attack', '#c8421a');
    var font = cssVar(styles, '--font-sans', 'sans-serif');

    var history = latest && latest.history ? latest.history : [];
    var lastT = history.length ? history[history.length - 1].t : 0;
    var xMax = Math.max(20, Math.ceil(lastT / 5) * 5);
    var xStep = xMax <= 25 ? 5 : (xMax <= 60 ? 10 : 20);

    var L = 46, R = 14, T = 34, B = 40;
    var pw = cssW - L - R, ph = cssH - T - B;
    var px = function (t) { return L + (t / xMax) * pw; };
    var py = function (v) { return T + ph - (v / 100) * ph; };

    ctx.font = '12px ' + font;
    ctx.textBaseline = 'middle';

    // grid + y labels
    ctx.lineWidth = 1;
    ctx.strokeStyle = cGrid;
    ctx.fillStyle = cMuted;
    ctx.textAlign = 'right';
    for (var v = 0; v <= 100; v += 25) {
      ctx.beginPath(); ctx.moveTo(L, py(v) + 0.5); ctx.lineTo(L + pw, py(v) + 0.5); ctx.stroke();
      ctx.fillText(v + '%', L - 6, py(v));
    }
    // x labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var t = 0; t <= xMax; t += xStep) {
      ctx.beginPath(); ctx.moveTo(px(t) + 0.5, T + ph); ctx.lineTo(px(t) + 0.5, T + ph + 4); ctx.stroke();
      ctx.fillText(String(t), px(t), T + ph + 6);
    }
    var xTitle = 'Simulated seconds';

    // legend (top-left) and the "Simulated data" label (top-right, or under the axis if it will not fit)
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    var simLabel = 'Simulated data';
    // pick the longest legend wording that fits on one row (phones get the short one)
    var legends = [['Availability %', 'Queue utilisation %'], ['Availability', 'Queue util.'], ['Avail.', 'Queue']];
    var legend = legends[legends.length - 1];
    var legendW = 0;
    for (var li = 0; li < legends.length; li++) {
      legendW = 34 + ctx.measureText(legends[li][0]).width + 18 + 34 + ctx.measureText(legends[li][1]).width;
      if (L + legendW < cssW - R) { legend = legends[li]; break; }
    }
    var simFits = L + legendW + 14 + ctx.measureText(simLabel).width < cssW - R;
    var x = L;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = cAvail; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x + 28, 14); ctx.stroke();
    ctx.fillStyle = cText; ctx.fillText(legend[0], x + 34, 14);
    x += 34 + ctx.measureText(legend[0]).width + 18;
    ctx.strokeStyle = cQueue; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x + 28, 14); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = cText; ctx.fillText(legend[1], x + 34, 14);
    if (simFits) {
      ctx.textAlign = 'right'; ctx.fillStyle = cMuted;
      ctx.fillText(simLabel, cssW - R, 14);
    } else {
      xTitle += ' · ' + simLabel;
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillStyle = cMuted;
    ctx.fillText(xTitle, L + pw / 2, cssH - 2);

    // data lines
    function line(key, color, dash) {
      if (!history.length) return;
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.setLineDash(dash);
      ctx.beginPath();
      history.forEach(function (row, i) {
        if (i === 0) ctx.moveTo(px(row.t), py(row[key])); else ctx.lineTo(px(row.t), py(row[key]));
      });
      ctx.stroke();
      ctx.setLineDash([]);
      var last = history[history.length - 1];
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(px(last.t), py(last[key]), 3.5, 0, Math.PI * 2); ctx.fill();
    }
    line('queueUtil', cQueue, [6, 4]);
    line('availability', cAvail, []);

    var last = history[history.length - 1];
    canvas.setAttribute('aria-label', last
      ? 'History chart (simulated data). At ' + last.t + ' simulated seconds availability is ' + Math.round(last.availability) +
        ' percent and queue utilisation is ' + Math.round(last.queueUtil) + ' percent.'
      : 'History chart of availability and queue utilisation (simulated data). No data yet.');
  }

  function bindResize() {
    if (resizeBound) return;
    resizeBound = true;
    var redraw = function () { chartSize = { w: 0, h: 0, dpr: 0 }; requestAnimationFrame(drawChart); };
    window.addEventListener('resize', redraw);
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', redraw);
    }
    var canvas = $('chart-history');
    if (canvas && window.ResizeObserver) {
      new ResizeObserver(function () {
        if (canvas.clientWidth && Math.round(canvas.clientWidth) !== chartSize.w) requestAnimationFrame(drawChart);
      }).observe(canvas);
    }
  }

  // ---- toasts --------------------------------------------------------------
  function toastHost() {
    var host = $('toast-container');
    if (host) return host;
    host = document.createElement('div');
    host.id = 'toast-container';
    host.setAttribute('aria-hidden', 'true');   // the same text is announced through #notifications
    host.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:1000;display:flex;flex-direction:column;gap:8px;max-width:calc(100vw - 32px)';
    document.body.appendChild(host);
    return host;
  }

  function notify(message, level) {
    level = LEVEL_WORD[level] ? level : 'info';
    var live = $('notifications');
    if (live) {
      live.textContent = '';
      setTimeout(function () { live.textContent = message; }, 40);   // clear first so repeats are re-announced
    }
    var host = toastHost();
    while (host.children.length >= MAX_TOASTS) host.removeChild(host.firstChild);
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + level;
    toast.textContent = LEVEL_WORD[level] + ': ' + message;
    host.appendChild(toast);
    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, TOAST_MS);
  }

  // ---- log -----------------------------------------------------------------
  function two(n) { return n < 10 ? '0' + n : String(n); }

  function addLog(message, level, simT) {
    var list = $('log-list');
    if (!list) return;
    level = LEVEL_WORD[level] ? level : 'info';
    var now = new Date();
    var li = document.createElement('li');
    li.className = 'log-entry log-entry--' + level;

    var wall = document.createElement('span');
    wall.className = 'log-entry__time';
    wall.textContent = two(now.getHours()) + ':' + two(now.getMinutes()) + ':' + two(now.getSeconds());
    var levelWord = document.createElement('span');
    levelWord.className = 'log-entry__level';
    levelWord.textContent = LEVEL_WORD[level];
    var text = document.createElement('span');
    text.className = 'log-entry__message';
    text.textContent = message;
    li.appendChild(wall);
    li.appendChild(document.createTextNode(' '));
    if (typeof simT === 'number') {
      var sim = document.createElement('span');
      sim.className = 'log-entry__sim';
      sim.textContent = '(t = ' + simT + ' s)';
      li.appendChild(sim);
      li.appendChild(document.createTextNode(' '));
    }
    li.appendChild(levelWord);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(text);

    list.insertBefore(li, list.firstChild);              // newest first
    while (list.children.length > MAX_LOG_ENTRIES) list.removeChild(list.lastChild);
  }

  Lab.Log = {
    add: function (message, level) {
      // Simulated time is shown only while a run is active.
      var t = engineRef && engineRef.isRunning() ? engineRef.getState().t : undefined;
      addLog(message, level, t);
    },
    clear: function () {
      var list = $('log-list');
      if (list) list.textContent = '';
    }
  };

  // ---- comparison ----------------------------------------------------------
  var ROWS = [
    { label: 'Pending connections (peak)', key: 'peakPending', unit: '',  lowerIsBetter: true },
    { label: 'Legitimate connection success', key: 'legitSuccessRate', unit: '%', lowerIsBetter: false },
    { label: 'Avg response time (ms)', key: 'avgResponseTimeMs', unit: '', lowerIsBetter: true },
    { label: 'Peak server resource usage (%)', key: 'peakCpu', unit: '%', lowerIsBetter: true },
    { label: 'Service availability (avg %)', key: 'avgAvailability', unit: '%', lowerIsBetter: false },
    { label: 'Final server state', key: 'finalServerState', unit: '', text: true }
  ];

  function cell(tag, text, scope) {
    var c = document.createElement(tag);
    if (scope) c.setAttribute('scope', scope);
    c.textContent = text;
    return c;
  }

  function valueText(run, row) {
    if (!run || run[row.key] === undefined || run[row.key] === null) return '—';
    return row.text ? String(run[row.key]) : fmt(Math.round(run[row.key])) + row.unit;
  }

  function renderTable(runs) {
    var table = $('compare-table');
    if (!table) return;
    table.textContent = '';
    var caption = document.createElement('caption');
    caption.className = 'visually-hidden';
    caption.textContent = 'Comparison of baseline, attack and mitigated runs (simulated data)';
    table.appendChild(caption);

    var thead = document.createElement('thead');
    var hr = document.createElement('tr');
    ['Metric', 'Baseline', 'Under attack', 'With mitigation'].forEach(function (h) { hr.appendChild(cell('th', h, 'col')); });
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    ROWS.forEach(function (row) {
      var tr = document.createElement('tr');
      tr.appendChild(cell('th', row.label, 'row'));
      tr.appendChild(cell('td', valueText(runs.baseline, row)));
      tr.appendChild(cell('td', valueText(runs.attack, row)));
      var td = cell('td', valueText(runs.mitigated, row));
      // change indicator: mitigated column relative to the attack column (numbers only)
      if (!row.text && runs.mitigated && runs.attack &&
          typeof runs.mitigated[row.key] === 'number' && typeof runs.attack[row.key] === 'number') {
        var diff = Math.round(runs.mitigated[row.key]) - Math.round(runs.attack[row.key]);
        if (diff !== 0) {
          var up = diff > 0;
          var good = row.lowerIsBetter ? !up : up;
          var span = document.createElement('span');
          span.className = 'compare-change compare-change--' + (good ? 'good' : 'bad') + ' compare-change--' + (up ? 'up' : 'down');
          span.textContent = ' ' + (up ? '▲' : '▼') + ' ' + fmt(Math.abs(diff)) + row.unit;
          var sr = document.createElement('span');
          sr.className = 'visually-hidden';
          sr.textContent = (up ? ' increase' : ' decrease') + ' of ' + fmt(Math.abs(diff)) + ' compared with the attack run, which is ' + (good ? 'better' : 'worse');
          td.appendChild(span);
          td.appendChild(sr);
        }
      }
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  }

  function joinNames(list) {
    if (list.length <= 1) return list.join('');
    return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
  }

  function buildExplanation(runs) {
    var cap = getCapacity();
    var sentences = [];
    var base = runs.baseline, atk = runs.attack, mit = runs.mitigated;

    if (atk) {
      var level = atk.level ? atk.level + ' ' : '';
      var a = Math.round(atk.avgAvailability);
      if (base && Math.round(base.avgAvailability) > a) {
        sentences.push('During the ' + level + 'flood availability fell from ' + Math.round(base.avgAvailability) + '% to ' + a +
          '% because pending connections reached ' + atk.peakPending + '/' + cap + '.');
      } else {
        sentences.push('During the ' + level + 'flood average availability was ' + a + '% and pending connections peaked at ' +
          atk.peakPending + '/' + cap + '.');
      }
      sentences.push('The server finished in the ' + atk.finalServerState + ' state, with response time averaging ' +
        fmt(Math.round(atk.avgResponseTimeMs)) + ' ms.');
    } else if (base) {
      sentences.push('With normal traffic only, average availability was ' + Math.round(base.avgAvailability) +
        '% and the server finished ' + base.finalServerState + '.');
    }

    if (mit) {
      var used = Object.keys(MITIGATION_NAMES).filter(function (k) { return mit.mitigation && mit.mitigation[k]; })
        .map(function (k) { return MITIGATION_NAMES[k]; });
      var m = Math.round(mit.avgAvailability);
      var verb = atk ? (m > Math.round(atk.avgAvailability) ? 'it recovered to ' : (m < Math.round(atk.avgAvailability) ? 'it dropped to ' : 'it stayed at ')) : 'availability was ';
      sentences.push(used.length
        ? 'With ' + joinNames(used) + ' enabled, ' + verb + m + '% and pending connections peaked at ' + mit.peakPending + '.'
        : 'With no mitigation enabled, ' + verb + m + '% and pending connections peaked at ' + mit.peakPending + '.');
    }

    if (!sentences.length) return 'Run the baseline, the attack and a mitigated run to see how they compare.';
    sentences.push('No single defence fully prevents real-world denial-of-service attacks; these figures are simulated estimates.');
    return sentences.join(' ');
  }

  function renderComparison(runs) {
    runs = runs || {};
    renderTable(runs);
    var p = $('compare-explanation');
    if (p) p.textContent = buildExplanation(runs);
  }

  // ---- public API ----------------------------------------------------------
  function zeroCards() {
    setCard('syn-incoming', '0');
    setCard('pending', '0 / ' + fmt(getCapacity()));
    setCard('completed', '0');
    setCard('rejected', '0');
    setCard('queue-util', '0%', 0);
    setCard('cpu', '0%', 0);
    setCard('response-time', '40');
    setCard('availability', '100%', 100);
  }

  Lab.Dashboard = {
    init: function (engine) {
      unsubs.forEach(function (u) { u(); });
      unsubs = [];
      engineRef = engine || null;
      initProgressSemantics();
      bindResize();
      if (engine) {
        latest = engine.getState();
        unsubs.push(engine.on('tick', function (state) { latest = state; schedulePaint(); }));
        unsubs.push(engine.on('serverStateChange', function (e) {
          latest = engine.getState();
          schedulePaint();
          if (e.to === 'Degraded' || e.to === 'Unavailable') {
            notify('Server is now ' + e.to + ' (simulated, t = ' + e.t + ' s).', e.to === 'Unavailable' ? 'danger' : 'warn');
          } else if (e.to === 'Healthy' && e.from !== 'Healthy') {
            notify('Server has recovered and is Healthy (simulated).', 'success');
          }
        }));
        unsubs.push(engine.on('log', function (e) { addLog(e.message, e.level, e.t); }));
      }
      zeroCards();
      renderBadge('Healthy');
      drawChart();
    },

    notify: notify,

    renderComparison: renderComparison,

    reset: function () {
      latest = engineRef ? engineRef.getState() : null;
      if (latest) latest.history = [];          // the chart starts empty again
      zeroCards();
      renderBadge('Healthy');
      chartSize = { w: 0, h: 0, dpr: 0 };
      drawChart();
      var table = $('compare-table');
      if (table) table.textContent = '';
      var p = $('compare-explanation');
      if (p) p.textContent = '';
      var host = $('toast-container');
      if (host) host.textContent = '';
      var live = $('notifications');
      if (live) live.textContent = '';
    }
  };
})(window.Lab);

/* ===== js/quiz.js ===== */
/* ==========================================================================
   quiz.js — OWNER: Manvith Karkera
   Purpose: quiz rendering and scoring (Lab.Quiz, CONTRACT §5.8).
   Shows ONE question at a time with four radio-style option buttons, a Submit
   button, immediate feedback (.is-correct / .is-wrong plus the explanation; a
   wrong answer also shows the right option and why), a Next button and a
   "Question 2 of 6" progress label. At the end it shows the score in
   #quiz-score and calls onFinished({ score, total }) exactly once.
   Accessibility: fieldset + legend, a radiogroup with arrow-key navigation,
   focus moves to the feedback after Submit and to the next question after Next.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var container = null;
  var questions = [];
  var onFinishedCb = null;
  var index = 0;
  var score = 0;
  var finishedFired = false;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function scoreEl() { return document.getElementById('quiz-score'); }

  function clearScore() {
    var s = scoreEl();
    if (s) s.textContent = '';
  }

  function renderQuestion() {
    var q = questions[index];
    container.textContent = '';

    var progress = el('p', 'quiz-progress', 'Question ' + (index + 1) + ' of ' + questions.length);
    var bar = el('div', 'quiz-progress__track');
    bar.setAttribute('aria-hidden', 'true');
    var fill = el('div', 'quiz-progress__bar');
    fill.style.width = (index / questions.length * 100) + '%';
    bar.appendChild(fill);

    var fieldset = el('fieldset', 'quiz-question');
    var legend = el('legend', null, q.question);
    legend.id = 'quiz-legend-' + q.id;
    fieldset.appendChild(legend);

    var group = el('div', 'quiz-options');
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-labelledby', legend.id);

    var options = [];
    var selected = -1;

    function select(i) {
      selected = i;
      options.forEach(function (btn, k) {
        btn.setAttribute('aria-checked', k === i ? 'true' : 'false');
        btn.tabIndex = k === i ? 0 : -1;
        btn.classList.toggle('is-selected', k === i);
      });
      submit.disabled = false;
    }

    q.options.forEach(function (text, i) {
      var btn = el('button', 'quiz-option');
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.tabIndex = i === 0 ? 0 : -1;                                // roving tabindex: one tab stop for the group
      var letter = el('span', 'quiz-option__key', String.fromCharCode(65 + i));
      letter.setAttribute('aria-hidden', 'true');
      btn.appendChild(letter);
      btn.appendChild(el('span', 'quiz-option__text', text));
      btn.addEventListener('click', function () { select(i); });
      btn.addEventListener('keydown', function (e) {
        var next = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % options.length;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + options.length) % options.length;
        if (next >= 0) { e.preventDefault(); options[next].focus(); select(next); }
      });
      options.push(btn);
      group.appendChild(btn);
    });
    fieldset.appendChild(group);

    var feedback = el('div', 'quiz-feedback');
    feedback.tabIndex = -1;
    feedback.setAttribute('role', 'status');

    var actions = el('div', 'quiz-actions');
    var submit = el('button', 'btn btn--primary', 'Submit answer');
    submit.type = 'button';
    submit.disabled = true;
    var next = el('button', 'btn btn--primary', index === questions.length - 1 ? 'See my score' : 'Next question');
    next.type = 'button';
    next.hidden = true;
    actions.appendChild(submit);
    actions.appendChild(next);

    submit.addEventListener('click', function () {
      if (selected < 0) return;
      var correct = q.answer;
      var right = selected === correct;
      if (right) score++;
      options.forEach(function (btn, k) {
        btn.disabled = true;                                           // answered: no more changes
        if (k === correct) btn.classList.add('is-correct');
        if (k === selected && !right) btn.classList.add('is-wrong');
      });
      feedback.textContent = '';
      feedback.appendChild(el('strong', null, right ? 'Correct. ' : 'Not quite. '));
      if (!right) feedback.appendChild(document.createTextNode('The right answer is “' + q.options[correct] + '”. '));
      feedback.appendChild(document.createTextNode(q.explanation));
      submit.hidden = true;
      next.hidden = false;
      feedback.focus();
    });

    next.addEventListener('click', function () {
      index++;
      if (index < questions.length) {
        renderQuestion();
        var first = container.querySelector('.quiz-option');
        if (first) first.focus();
      } else {
        showResult();
      }
    });

    container.appendChild(progress);
    container.appendChild(bar);
    container.appendChild(fieldset);
    container.appendChild(feedback);
    container.appendChild(actions);
  }

  function showResult() {
    var total = questions.length;
    var percent = Math.round(score / total * 100);
    container.textContent = '';
    var summary = el('div', 'quiz-result');
    summary.tabIndex = -1;
    summary.appendChild(el('p', 'quiz-result__score', score + ' / ' + total));
    summary.appendChild(el('p', null, percent >= 67
      ? 'Well done! You understand how a SYN flood works and how defences help.'
      : 'Good effort. Review the theory and the comparison table, then reset the lab to try again.'));
    container.appendChild(summary);

    var s = scoreEl();
    if (s) s.textContent = 'Quiz score: ' + score + ' / ' + total + ' (' + percent + '%)';
    summary.focus();

    if (!finishedFired) {
      finishedFired = true;
      if (typeof onFinishedCb === 'function') onFinishedCb({ score: score, total: total });
    }
  }

  Lab.Quiz = {
    init: function (containerEl, qs, onFinished) {
      container = containerEl;
      questions = qs || [];
      onFinishedCb = onFinished;
      index = 0;
      score = 0;
      finishedFired = false;
      clearScore();
      if (!container) return;
      if (!questions.length) { container.textContent = ''; return; }
      renderQuestion();
    },

    reset: function () {
      index = 0;
      score = 0;
      finishedFired = false;
      if (container) container.textContent = '';
      clearScore();
    }
  };
})(window.Lab);

/* ===== js/workshop.js ===== */
/* ==========================================================================
   workshop.js — OWNER: Manvith Karkera
   Purpose: "Part 2: Defender's Workshop" (Lab.Workshop). Five modules built from
   Lab.Content.workshop: Understand, Investigate, Harden, Choose layers, Run the
   incident.

   Two halves:
   1. A small, PURE simulated Linux shell (Lab.Workshop.shell): createHost(), run(),
      evaluate(). It understands the real commands a defender uses (sysctl, ss,
      netstat, dmesg, tcpdump, iptables, nft, ipset, curl, ...), keeps its own host
      state, and never touches the real machine. It has no DOM code, so it is unit
      tested in Node (tests/shell.test.js).
   2. The UI, which renders the modules, drives the terminal and replays the attack
      against the student's hardened configuration with a private engine instance.

   The shell evaluates the host configuration into the same four defences the
   simulation engine knows (SYN cookies, rate limiting, shorter timeouts, firewall),
   so the hardening result is produced by the same cause-and-effect model as Part 1.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var ATTACK_RATE = { low: 300, medium: 1500, high: 6000 };   // forged SYN per second against web01
  var ATTACK_SECONDS_LOGGED = 600;                             // the attack has been running about ten minutes

  // =========================================================================
  // 1. SIMULATED SHELL (pure)
  // =========================================================================
  var SYSCTL_RANGES = {
    'net.ipv4.tcp_syncookies': [0, 2],
    'net.ipv4.tcp_max_syn_backlog': [1, 1048576],
    'net.core.somaxconn': [1, 65535],
    'net.ipv4.tcp_synack_retries': [0, 255],
    'net.ipv4.tcp_abort_on_overflow': [0, 1],
    'net.ipv4.tcp_timestamps': [0, 2],
    'net.netfilter.nf_conntrack_tcp_loose': [0, 1]
  };
  var SYSCTL_ORDER = Object.keys(SYSCTL_RANGES);
  var SYSCTL_FILES = ['/etc/sysctl.conf'];                    // /etc/sysctl.d/*.conf is accepted by prefix
  var BASE_LINES = [
    'Linux web01 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux'
  ];

  function createHost() {
    return {
      sysctl: {
        'net.ipv4.tcp_syncookies': 0,                         // a "performance" profile switched cookies off
        'net.ipv4.tcp_max_syn_backlog': 256,
        'net.core.somaxconn': 128,
        'net.ipv4.tcp_synack_retries': 5,
        'net.ipv4.tcp_abort_on_overflow': 0,
        'net.ipv4.tcp_timestamps': 1,
        'net.netfilter.nf_conntrack_tcp_loose': 1
      },
      files: { '/etc/sysctl.conf': '', '/etc/sysctl.d/99-synflood.conf': '' },
      fileVersion: 0,
      loadedVersion: 0,
      rules: [],                                              // iptables and nft rules in the order they were added
      ipsets: {},
      ran: { count: false, klog: false, capture: false },
      cmdCount: 0,
      level: 'medium',
      lastTest: null
    };
  }

  // ---- tokenising ----------------------------------------------------------
  function splitPipes(line) {
    var parts = [], cur = '', q = null;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (q) { cur += c; if (c === q) q = null; }
      else if (c === '"' || c === "'") { q = c; cur += c; }
      else if (c === '|') { parts.push(cur); cur = ''; }
      else cur += c;
    }
    if (q) return null;                                       // unbalanced quote
    parts.push(cur);
    return parts;
  }

  function tokenize(s) {
    var out = [], cur = '', q = null, has = false;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (q) { if (c === q) q = null; else cur += c; }
      else if (c === '"' || c === "'") { q = c; has = true; }
      else if (/\s/.test(c)) { if (has || cur) { out.push(cur); cur = ''; has = false; } }
      else { cur += c; has = true; }
    }
    if (has || cur) out.push(cur);
    return out;
  }

  // ---- output items ----------------------------------------------------------
  // An output item is a string, or { gen: function(i) -> string, n: count } for a group of similar lines
  // (e.g. 4096 SYN-RECV sockets), so counts stay exact without building thousands of strings.
  function itemCount(it) { return typeof it === 'string' ? 1 : it.n; }
  function itemText(it, i) { return typeof it === 'string' ? it : it.gen(i); }
  function totalLines(items) { return items.reduce(function (a, it) { return a + itemCount(it); }, 0); }

  function takeHead(items, k) {
    var out = [], left = k;
    items.forEach(function (it) {
      if (left <= 0) return;
      var n = itemCount(it);
      if (n <= left) { out.push(it); left -= n; }
      else { out.push({ gen: it.gen, n: left }); left = 0; }
    });
    return out;
  }

  function takeTail(items, k) {
    var out = [], left = k;
    for (var j = items.length - 1; j >= 0 && left > 0; j--) {
      var it = items[j], n = itemCount(it);
      if (n <= left) { out.unshift(it); left -= n; }
      else {
        var skip = n - left, g = it.gen;
        out.unshift({ gen: function (i) { return g(i + skip); }, n: left }); left = 0;
      }
    }
    return out;
  }

  function mulberry(seed) {
    var a = seed | 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randIp(rnd) {
    var first = [5, 14, 24, 36, 45, 62, 77, 91, 103, 118, 141, 168, 185, 190, 200, 212][Math.floor(rnd() * 16)];
    return first + '.' + Math.floor(rnd() * 255) + '.' + Math.floor(rnd() * 255) + '.' + (1 + Math.floor(rnd() * 253));
  }

  // ---- attack model: what the host looks like under the flood ----------------
  function toInt(v) { return typeof v === 'number' ? v : parseInt(v, 10); }

  function attackModel(host) {
    var ev = evaluate(host);
    var rate = ATTACK_RATE[host.level] || ATTACK_RATE.medium;
    var retries = toInt(host.sysctl['net.ipv4.tcp_synack_retries']);
    var life = Math.pow(2, retries + 1) - 1;
    var backlog = toInt(host.sysctl['net.ipv4.tcp_max_syn_backlog']);
    var through = rate;                                       // forged SYN per second that reach the TCP stack
    if (ev.status.globalLimit) through = Math.min(rate, ev.status.globalLimit.rate);
    if (ev.status.synproxyActive) through = Math.round(rate * 0.02);   // SYNPROXY absorbs the handshake in the firewall
    var wanted = through * life;                              // Little's law
    var cookies = ev.status.cookies >= 1;
    return {
      rate: rate, life: life, backlog: backlog, through: through, wanted: wanted,
      synrecv: Math.min(backlog, wanted),
      full: wanted >= backlog,
      cookies: cookies,
      refusing: wanted >= backlog && !cookies,
      ev: ev
    };
  }

  // ---- evaluating the host configuration ------------------------------------
  function parseRate(s) {                                      // "400/s", "400/sec", "400/second", "6000/min"
    var m = /^(\d+)\/(s|sec|second|m|min|minute|h|hour)$/i.exec(s || '');
    if (!m) return null;
    var n = parseInt(m[1], 10), u = m[2].toLowerCase()[0];
    return u === 's' ? n : (u === 'm' ? n / 60 : n / 3600);
  }

  function parseConf(text) {
    var out = {};
    String(text || '').split('\n').forEach(function (l) {
      l = l.trim();
      if (!l || l[0] === '#') return;
      var m = /^([a-z0-9_.]+)\s*=\s*(-?\d+)$/i.exec(l);
      if (m) out[m[1]] = parseInt(m[2], 10);
    });
    return out;
  }

  function evaluate(host) {
    var s = host.sysctl;
    var cookies = toInt(s['net.ipv4.tcp_syncookies']);
    var retries = toInt(s['net.ipv4.tcp_synack_retries']);
    var backlog = toInt(s['net.ipv4.tcp_max_syn_backlog']);
    var somax = toInt(s['net.core.somaxconn']);
    var loose = toInt(s['net.netfilter.nf_conntrack_tcp_loose']);
    var peak = (Lab.Content && Lab.Content.workshop && Lab.Content.workshop.scenario.normalPeakSynPerSec) || 150;

    var filterRules = host.rules.filter(function (r) { return r.table === 'filter'; });
    var globalLimit = null, perSource = false, blocklist = false, incomplete = false, lowLimit = false;
    filterRules.forEach(function (r, idx) {
      if (!r.syn) return;
      if (r.nft) {
        if (r.perSource) perSource = true;
        else if (r.overRate && /drop|reject/.test(r.action)) globalLimit = globalLimit || { rate: r.overRate, kind: 'nft' };
        else if (r.limitRate && r.action === 'accept') {
          var laterDrop = filterRules.slice(idx + 1).some(function (x) { return x.syn && /drop|reject/.test(x.action) && !x.limitRate && !x.overRate; });
          if (laterDrop) globalLimit = globalLimit || { rate: r.limitRate, kind: 'nft' }; else incomplete = true;
        }
        return;
      }
      if (r.mods.indexOf('hashlimit') >= 0 && /DROP|REJECT/.test(r.target)) {
        if (/srcip/.test(r.hashMode || '')) perSource = true;
        else if (r.hashAbove) globalLimit = globalLimit || { rate: r.hashAbove, kind: 'hashlimit' };
      } else if (r.mods.indexOf('limit') >= 0 && r.target === 'ACCEPT') {
        var later = filterRules.slice(idx + 1).some(function (x) { return x.syn && /^(DROP|REJECT)$/.test(x.target) && x.mods.indexOf('limit') < 0 && x.mods.indexOf('hashlimit') < 0; });
        if (later) globalLimit = globalLimit || { rate: r.limitRate || 1, kind: 'limit' }; else incomplete = true;
      } else if ((r.mods.indexOf('connlimit') >= 0 || r.mods.indexOf('recent') >= 0) && /DROP|REJECT/.test(r.target)) {
        perSource = true;
      } else if (r.mods.indexOf('set') >= 0 && /DROP|REJECT/.test(r.target)) {
        blocklist = true;
      }
    });
    if (globalLimit && globalLimit.rate < peak) { lowLimit = true; }

    var rawNotrack = host.rules.some(function (r) { return r.table === 'raw' && r.chain === 'PREROUTING' && r.target === 'CT' && r.notrack && r.syn; });
    var synproxyRule = host.rules.some(function (r) { return r.target === 'SYNPROXY' && r.chain === 'INPUT'; });
    var synproxyActive = rawNotrack && synproxyRule && loose === 0 && cookies >= 1;

    var defences = {
      synCookies: cookies >= 1,
      shortTimeout: retries >= 0 && retries <= 3,
      rateLimit: !!globalLimit && !lowLimit,
      firewall: synproxyActive
    };

    var notes = [];
    if (cookies >= 1) notes.push({ level: 'good', text: 'SYN cookies are on (tcp_syncookies = ' + cookies + '), so genuine clients can connect while the queue is full.' });
    else notes.push({ level: 'bad', text: 'SYN cookies are off. When the SYN queue fills, the kernel can only drop new SYNs, so genuine customers are refused too.' });
    if (retries >= 1 && retries <= 3) notes.push({ level: 'good', text: 'tcp_synack_retries = ' + retries + ' removes forged entries after ' + (Math.pow(2, retries + 1) - 1) + ' s instead of 63 s.' });
    else if (retries === 0) notes.push({ level: 'warn', text: 'tcp_synack_retries = 0 never retransmits a SYN-ACK. It frees entries instantly but also breaks genuine clients on lossy mobile links.' });
    else if (retries > 3) notes.push({ level: 'warn', text: 'tcp_synack_retries = ' + retries + ' keeps every forged entry for ' + (Math.pow(2, retries + 1) - 1) + ' s, which makes the queue easier to fill.' });
    if (backlog >= 2048 && somax >= 2048) notes.push({ level: 'info', text: 'Larger queues (backlog ' + backlog + ', somaxconn ' + somax + ') buy time and absorb bursts, but a sustained flood still fills them.' });
    if (globalLimit && !lowLimit) notes.push({ level: 'good', text: 'A global SYN limit of ' + Math.round(globalLimit.rate) + '/s caps what reaches the TCP stack without depending on the (forged) source address.' });
    if (lowLimit) notes.push({ level: 'bad', text: 'Your SYN limit (' + Math.round(globalLimit.rate) + '/s) is below the normal customer peak of about ' + peak + '/s. You would block genuine customers even without an attack.' });
    if (incomplete) notes.push({ level: 'warn', text: 'A rate-limit ACCEPT rule on its own changes nothing, because the default policy is ACCEPT. Add a DROP rule for SYN packets after it.' });
    if (perSource && !globalLimit) notes.push({ level: 'warn', text: 'A per-source limit (srcip, connlimit, recent) does not stop a spoofed flood: every packet claims a different source address, so none exceeds the limit. It is still good against a single real abuser.' });
    if (blocklist) notes.push({ level: 'warn', text: 'A static blocklist does not help against forged, changing source addresses and can block innocent networks.' });
    if (synproxyRule && !synproxyActive) notes.push({ level: 'warn', text: 'A SYNPROXY rule exists but is not effective yet. It needs the raw-table NOTRACK rule, nf_conntrack_tcp_loose = 0, and tcp_syncookies enabled.' });
    if (synproxyActive) notes.push({ level: 'good', text: 'SYNPROXY is active: the firewall completes the handshake and only forwards connections that proved they are real.' });

    return {
      defences: defences,
      notes: notes,
      blocksCustomers: lowLimit,
      status: {
        cookies: cookies, retries: retries, backlog: backlog, somaxconn: somax, loose: loose,
        globalLimit: globalLimit, perSource: perSource, blocklist: blocklist, incomplete: incomplete,
        rawNotrack: rawNotrack, synproxyRule: synproxyRule, synproxyActive: synproxyActive, lowLimit: lowLimit
      }
    };
  }

  // ---- sysctl ---------------------------------------------------------------
  function sysctlPath(key) { return '/proc/sys/' + key.replace(/\./g, '/'); }

  function sysctlSet(host, key, val, out) {
    if (!(key in SYSCTL_RANGES)) {
      out.push('sysctl: cannot stat ' + sysctlPath(key) + ': No such file or directory');
      return false;
    }
    if (!/^-?\d+$/.test(String(val))) { out.push('sysctl: setting key "' + key + '": Invalid argument'); return false; }
    var n = parseInt(val, 10), r = SYSCTL_RANGES[key];
    if (n < r[0] || n > r[1]) { out.push('sysctl: setting key "' + key + '": Invalid argument'); return false; }
    host.sysctl[key] = n;
    out.push(key + ' = ' + n);
    return true;
  }

  function loadConfFile(host, path, out) {
    var conf = parseConf(host.files[path]);
    Object.keys(conf).forEach(function (k) { sysctlSet(host, k, conf[k], out); });
  }

  function cmdSysctl(host, a) {
    var out = [];
    var args = a.slice(1);
    var quiet = false, all = false, load = null, system = false, write = false;
    var keys = [];
    for (var i = 0; i < args.length; i++) {
      var t = args[i];
      if (t === '-n') quiet = true;
      else if (t === '-a' || t === '--all') all = true;
      else if (t === '-w' || t === '--write') write = true;
      else if (t === '--system') system = true;
      else if (t === '-p' || t === '--load') { load = (args[i + 1] && args[i + 1][0] !== '-') ? args[++i] : '/etc/sysctl.conf'; }
      else if (t[0] === '-' && t.indexOf('=') < 0) { out.push('sysctl: invalid option -- \'' + t.replace(/^-+/, '') + '\''); return out; }
      else keys.push(t);
    }
    if (system) {
      Object.keys(host.files).sort().forEach(function (f) {
        if (/^\/etc\/sysctl\.d\/.*\.conf$/.test(f) || f === '/etc/sysctl.conf') {
          out.push('* Applying ' + f + ' ...');
          loadConfFile(host, f, out);
        }
      });
      host.loadedVersion = host.fileVersion;
      return out;
    }
    if (load) {
      if (!(load in host.files)) { out.push('sysctl: cannot open "' + load + '": No such file or directory'); return out; }
      loadConfFile(host, load, out);
      host.loadedVersion = host.fileVersion;
      return out;
    }
    if (all) {
      SYSCTL_ORDER.forEach(function (k) { out.push(k + ' = ' + host.sysctl[k]); });
      return out;
    }
    if (!keys.length) { out.push('sysctl: no variables specified', "Try `sysctl --help' for more information."); return out; }
    keys.forEach(function (k) {
      var eq = k.indexOf('=');
      if (eq > 0) {                                           // key=value (a write)
        sysctlSet(host, k.slice(0, eq).replace(/\s+/g, ''), k.slice(eq + 1), out);
      } else if (write) {
        out.push('sysctl: "' + k + '" must be of the form name=value');
      } else if (k in SYSCTL_RANGES) {
        out.push(quiet ? String(host.sysctl[k]) : k + ' = ' + host.sysctl[k]);
      } else {
        out.push('sysctl: cannot stat ' + sysctlPath(k) + ': No such file or directory');
      }
    });
    return out;
  }

  // ---- files, echo, tee --------------------------------------------------------
  function writeFile(host, path, text, append) {
    var allowed = path === '/etc/sysctl.conf' || /^\/etc\/sysctl\.d\/[A-Za-z0-9._-]+\.conf$/.test(path);
    if (!allowed) return '-bash: ' + path + ': Read-only in this lab (use /etc/sysctl.d/99-synflood.conf)';
    var cur = host.files[path] || '';
    host.files[path] = append ? cur + text + '\n' : text + '\n';
    host.fileVersion++;
    return null;
  }

  // ---- ss / netstat ------------------------------------------------------------
  function ssLines(host, args) {
    var m = attackModel(host);
    var seed = host.cmdCount * 7919 + 17;
    var noHeader = args.some(function (t) { return /^-[a-zA-Z]*H/.test(t); });
    if (args.indexOf('-s') >= 0) {
      var total = 211 + m.synrecv + 13;
      return [
        'Total: ' + (total + 6),
        'TCP:   ' + total + ' (estab 211, closed 3, orphaned 0, timewait 9)',
        '',
        'Transport Total     IP        IPv6',
        'RAW       0         0         0',
        'UDP       6         4         2',
        'TCP       ' + total + '      ' + (total - 4) + '      4',
        'INET      ' + (total + 6) + '      ' + (total + 2) + '      6',
        'FRAG      0         0         0'
      ];
    }
    var wantsSyn = args.indexOf('state') >= 0 && /syn-recv|syn_recv/i.test(args[args.indexOf('state') + 1] || '');
    var header = noHeader ? [] : ['State      Recv-Q  Send-Q   Local Address:Port    Peer Address:Port'];
    var rows = [];
    var rnd = mulberry(seed);
    var peers = [];
    for (var i = 0; i < 40; i++) peers.push(randIp(rnd) + ':' + (1024 + Math.floor(rnd() * 60000)));
    var syn = { gen: function (i) { return 'SYN-RECV   0       0        203.0.113.10:443      ' + peers[i % peers.length]; }, n: m.synrecv };
    var estab = { gen: function (i) { return 'ESTAB      0       0        203.0.113.10:443      198.51.100.' + (1 + (i % 250)) + ':' + (40000 + i); }, n: 211 };
    if (wantsSyn) { if (m.synrecv > 0) rows.push(syn); return header.concat(rows); }
    var listen = ['LISTEN     0       ' + m.backlog + '     0.0.0.0:443           0.0.0.0:*'];
    return header.concat(listen, [estab], m.synrecv > 0 ? [syn] : []);
  }

  function netstatLines(host, args) {
    var m = attackModel(host);
    if (args.indexOf('-s') >= 0 || args.some(function (t) { return /^-[a-z]*s$/.test(t); })) {
      var dropped = m.refusing ? Math.round(m.through * ATTACK_SECONDS_LOGGED * 0.62) : 0;
      var overflow = m.refusing ? Math.round(dropped / 6) : (m.full ? 41 : 0);
      var sent = m.cookies && m.full ? Math.round((m.through - m.backlog / m.life) * ATTACK_SECONDS_LOGGED) : 0;
      return [
        'Tcp:',
        '    18432 active connection openings',
        '    2291847 passive connection openings',
        '    1204 failed connection attempts',
        'TcpExt:',
        '    ' + overflow + ' times the listen queue of a socket overflowed',
        '    ' + dropped + ' SYNs to LISTEN sockets dropped',
        '    ' + Math.max(0, sent) + ' SYN cookies sent',
        '    ' + Math.round(Math.max(0, sent) * 0.0004) + ' SYN cookies received',
        '    0 SYN cookies failed'
      ];
    }
    var rnd = mulberry(host.cmdCount * 104729 + 3);
    var peers = [];
    for (var i = 0; i < 40; i++) peers.push(randIp(rnd) + ':' + (1024 + Math.floor(rnd() * 60000)));
    return [
      'Active Internet connections (servers and established)',
      'Proto Recv-Q Send-Q Local Address           Foreign Address         State',
      'tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN',
      { gen: function (i) { return 'tcp        0      0 203.0.113.10:443        198.51.100.' + (1 + (i % 250)) + ':' + (40000 + i) + '   ESTABLISHED'; }, n: 211 },
      { gen: function (i) { return 'tcp        0      0 203.0.113.10:443        ' + peers[i % peers.length] + '   SYN_RECV'; }, n: m.synrecv },
      { gen: function (i) { return 'tcp        0      0 203.0.113.10:443        198.51.100.' + (1 + (i % 250)) + ':' + (30000 + i) + '   TIME_WAIT'; }, n: 9 }
    ].filter(function (it) { return itemCount(it) > 0; });
  }

  function dmesgLines(host) {
    var m = attackModel(host);
    var out = [
      '[    0.000000] Linux version 5.15.0-91-generic (buildd@lcy02-amd64-045)',
      '[    5.311402] nf_conntrack: default automatic helper assignment has been turned off',
      '[ 8340.002118] nginx[921]: worker process 924 exited with code 0'
    ];
    if (m.full) {
      var verb = m.cookies ? 'Sending cookies.' : 'Dropping request.';
      out.push('[ 8412.113456] TCP: request_sock_TCP: Possible SYN flooding on port 443. ' + verb + '  Check SNMP counters.');
      out.push('[ 8472.481902] TCP: request_sock_TCP: Possible SYN flooding on port 443. ' + verb + '  Check SNMP counters.');
      out.push('[ 8532.907311] TCP: request_sock_TCP: Possible SYN flooding on port 443. ' + verb + '  Check SNMP counters.');
    } else {
      out.push('[ 8412.113456] TCP: request_sock_TCP: Possible SYN flooding on port 443. Sending cookies.  Check SNMP counters.');
    }
    return out;
  }

  function tcpdumpLines(host, args) {
    var cIdx = args.indexOf('-c');
    var n = cIdx >= 0 ? Math.max(1, Math.min(40, parseInt(args[cIdx + 1], 10) || 10)) : 10;
    var filter = args.filter(function (t) { return t[0] !== '-' && !/^\d+$/.test(t) && t !== 'eth0'; }).join(' ');
    var synOnly = /tcp-syn|\bsyn\b/.test(filter) && !/tcp-ack/.test(filter.replace(/tcp-syn\|tcp-ack/g, ''));
    var rnd = mulberry(host.cmdCount * 15485863 + 11);
    var out = [
      'tcpdump: verbose output suppressed, use -v[v]... for full protocol decode',
      'listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes'
    ];
    for (var i = 0; i < n; i++) {
      var usec = 100312 + i * 79 + Math.floor(rnd() * 20);
      var ip = randIp(rnd), port = 1024 + Math.floor(rnd() * 60000);
      var stamp = '02:14:07.' + String(usec).padStart(6, '0');
      var kind = synOnly ? 0 : rnd();
      if (kind < 0.75) out.push(stamp + ' IP ' + ip + '.' + port + ' > 203.0.113.10.443: Flags [S], seq ' + Math.floor(rnd() * 4294967295) + ', win 512, length 0');
      else if (kind < 0.9) out.push(stamp + ' IP 203.0.113.10.443 > ' + ip + '.' + port + ': Flags [S.], seq ' + Math.floor(rnd() * 4294967295) + ', ack 1, win 64240, options [mss 1460], length 0');
      else out.push(stamp + ' IP 198.51.100.' + (1 + Math.floor(rnd() * 250)) + '.' + (40000 + i) + ' > 203.0.113.10.443: Flags [.], ack 1, win 502, length 0');
    }
    out.push('', n + ' packets captured', n + ' packets received by filter', '0 packets dropped by kernel');
    return out;
  }

  function curlLines(host) {
    var m = attackModel(host);
    if (m.refusing) return ['curl: (28) Connection timed out after 5001 milliseconds'];
    if (m.full) return ['HTTP/2 200', 'server: nginx', 'time_connect: 0.92s  (slow: the host is strained but serving)'];
    return ['HTTP/2 200', 'server: nginx', 'time_connect: 0.04s'];
  }

  // ---- iptables ----------------------------------------------------------------
  var IPT_VERSION = 'iptables v1.8.7 (nf_tables)';
  var IPT_TABLES = { filter: ['INPUT', 'FORWARD', 'OUTPUT'], raw: ['PREROUTING', 'OUTPUT'], mangle: ['PREROUTING', 'INPUT', 'FORWARD', 'OUTPUT', 'POSTROUTING'], nat: ['PREROUTING', 'INPUT', 'OUTPUT', 'POSTROUTING'] };
  var IPT_TARGETS = ['ACCEPT', 'DROP', 'REJECT', 'LOG', 'RETURN', 'SYNPROXY', 'CT'];
  var IPT_MODULES = {
    tcp: ['--dport', '--sport', '--tcp-flags', '--syn'],
    limit: ['--limit', '--limit-burst'],
    hashlimit: ['--hashlimit-above', '--hashlimit-upto', '--hashlimit-mode', '--hashlimit-name', '--hashlimit-burst', '--hashlimit-htable-expire', '--hashlimit-srcmask', '--hashlimit-dstmask'],
    connlimit: ['--connlimit-above', '--connlimit-upto', '--connlimit-mask'],
    recent: ['--name', '--set', '--update', '--rcheck', '--seconds', '--hitcount', '--rsource', '--remove'],
    set: ['--match-set'],
    conntrack: ['--ctstate'],
    state: ['--state']
  };
  var IPT_NOARG = { '--syn': 1, '--notrack': 1, '--sack-perm': 1, '--timestamp': 1, '--set': 1, '--update': 1, '--rcheck': 1, '--rsource': 1, '--remove': 1 };
  var IPT_ARGC = { '--match-set': 2 };

  function cmdIptables(host, a) {
    var out = [];
    var args = a.slice(1);
    var table = 'filter', action = null, chain = null, insertAt = null;
    var rule = { table: 'filter', chain: '', mods: [], target: '', syn: false, proto: '', raw: '' };
    var listLike = false, flush = false, S = false;
    var i = 0;
    for (; i < args.length; i++) {
      var t = args[i];
      if (t === '-t') { table = args[++i]; if (!IPT_TABLES[table]) { return [IPT_VERSION + ': can\'t initialize iptables table `' + table + '\': Table does not exist (do you need to insmod?)']; } }
      else if (t === '-A' || t === '-I' || t === '-D') {
        action = t; chain = args[++i];
        if (t === '-I' && /^\d+$/.test(args[i + 1] || '')) insertAt = parseInt(args[++i], 10);
      }
      else if (t === '-L' || t === '--list') { listLike = true; if (args[i + 1] && args[i + 1][0] !== '-') chain = args[++i]; }
      else if (t === '-S') { S = true; if (args[i + 1] && args[i + 1][0] !== '-') chain = args[++i]; }
      else if (t === '-F' || t === '--flush') { flush = true; if (args[i + 1] && args[i + 1][0] !== '-') chain = args[++i]; }
      else if (t === '-n' || t === '-v' || t === '--line-numbers' || t === '-nv' || t === '-vn') { /* display flags */ }
      else if (t === '-p' || t === '--protocol') { rule.proto = (args[++i] || '').toLowerCase(); }
      else if (t === '-s' || t === '-d' || t === '-i' || t === '-o') { rule[t] = args[++i]; }
      else if (t === '-m' || t === '--match') {
        var mod = args[++i];
        if (!IPT_MODULES[mod]) { return [IPT_VERSION + ': Couldn\'t load match `' + mod + '\':No such file or directory', '', 'Try `iptables -h\' or \'iptables --help\' for more information.']; }
        rule.mods.push(mod);
      }
      else if (t === '-j' || t === '--jump' || t === '-g') {
        var tg = args[++i];
        if (IPT_TARGETS.indexOf(tg) < 0) { return [IPT_VERSION + ': Couldn\'t load target `' + tg + '\':No such file or directory', '', 'Try `iptables -h\' or \'iptables --help\' for more information.']; }
        rule.target = tg;
      }
      else if (t === '--syn') {
        if (rule.proto !== 'tcp') return [IPT_VERSION + ': unknown option "--syn"', 'Try `iptables -h\' or \'iptables --help\' for more information.'];
        rule.syn = true;
      }
      else if (t === '--tcp-flags') {
        if (rule.proto !== 'tcp') return [IPT_VERSION + ': unknown option "--tcp-flags"', 'Try `iptables -h\' or \'iptables --help\' for more information.'];
        var mask = (args[++i] || '').toUpperCase().split(','), set = (args[++i] || '').toUpperCase().split(',');
        if (mask.indexOf('SYN') >= 0 && set.indexOf('SYN') >= 0 && set.indexOf('ACK') < 0) rule.syn = true;
        rule.flags = mask.join(',') + ' ' + set.join(',');
      }
      else if (t === '--dport' || t === '--sport' || t === '--destination-port' || t === '--source-port') {
        if (rule.proto !== 'tcp' && rule.proto !== 'udp') return [IPT_VERSION + ': unknown option "' + t + '"', 'Try `iptables -h\' or \'iptables --help\' for more information.'];
        rule.port = args[++i];
      }
      else if (t === '--ctstate' || t === '--state') {
        var mset = (t === '--ctstate' ? 'conntrack' : 'state');
        if (rule.mods.indexOf(mset) < 0) return [IPT_VERSION + ': unknown option "' + t + '"', 'Try `iptables -h\' or \'iptables --help\' for more information.'];
        rule.ctstate = (args[++i] || '').toUpperCase();
      }
      else if (t === '--limit') {
        if (rule.mods.indexOf('limit') < 0) return [IPT_VERSION + ': unknown option "--limit"', 'Try `iptables -h\' or \'iptables --help\' for more information.'];
        rule.limitRate = parseRate(args[++i]); if (rule.limitRate === null) return [IPT_VERSION + ': Bad rate `' + args[i] + '\''];
      }
      else if (/^--hashlimit-(above|upto)$/.test(t)) {
        if (rule.mods.indexOf('hashlimit') < 0) return [IPT_VERSION + ': unknown option "' + t + '"', 'Try `iptables -h\' or \'iptables --help\' for more information.'];
        var hr = parseRate(args[++i]); if (hr === null) return [IPT_VERSION + ': Bad rate `' + args[i] + '\''];
        if (t === '--hashlimit-above') rule.hashAbove = hr; else rule.hashUpto = hr;
      }
      else if (t === '--hashlimit-mode') {
        if (rule.mods.indexOf('hashlimit') < 0) return [IPT_VERSION + ': unknown option "--hashlimit-mode"'];
        rule.hashMode = args[++i];
      }
      else if (t === '--notrack') { if (rule.target !== 'CT') return [IPT_VERSION + ': unknown option "--notrack"']; rule.notrack = true; }
      else if (t === '--sack-perm' || t === '--timestamp') { if (rule.target !== 'SYNPROXY') return [IPT_VERSION + ': unknown option "' + t + '"']; }
      else if (t === '--wscale' || t === '--mss' || t === '--log-prefix' || t === '--reject-with' || t === '--limit-burst' || t === '--hashlimit-name' || t === '--hashlimit-burst' || t === '--connlimit-above' || t === '--connlimit-mask' || t === '--seconds' || t === '--hitcount' || t === '--name' || t === '--hashlimit-htable-expire' || t === '--hashlimit-srcmask' || t === '--hashlimit-dstmask') { i++; }
      else if (t === '--match-set') { i += 2; rule.setName = args[i - 1]; }
      else if (t === '--set' || t === '--update' || t === '--rcheck' || t === '--rsource' || t === '--remove') { /* recent flags */ }
      else if (t === '-P' || t === '-N' || t === '-X' || t === '-Z') { i += 1; }
      else if (t === '-h' || t === '--help') { return ['iptables v1.8.7', 'Usage: iptables -[ACD] chain rule-specification [options]', '       iptables -L [chain] [-n -v]   |   iptables -S   |   iptables -F [chain]']; }
      else { return [IPT_VERSION + ': unknown option "' + t + '"', 'Try `iptables -h\' or \'iptables --help\' for more information.']; }
    }

    if (flush) {
      host.rules = host.rules.filter(function (r) { return !(r.table === table && (!chain || r.chain === chain)); });
      return out;
    }
    if (S || listLike) {
      var rows = host.rules.filter(function (r) { return r.table === table && (!chain || r.chain === chain); });
      if (S) {
        (IPT_TABLES[table] || []).forEach(function (c) { if (!chain || chain === c) out.push('-P ' + c + ' ACCEPT'); });
        rows.forEach(function (r) { out.push('-A ' + r.chain + ' ' + r.raw); });
        return out;
      }
      (IPT_TABLES[table] || []).forEach(function (c) {
        if (chain && chain !== c) return;
        out.push('Chain ' + c + ' (policy ACCEPT)');
        out.push('target     prot opt source               destination');
        rows.filter(function (r) { return r.chain === c; }).forEach(function (r) {
          out.push((r.target + '          ').slice(0, 10) + ' ' + ((r.proto || 'all') + '    ').slice(0, 4) + ' --  ' + (r['-s'] || 'anywhere') + '            ' + (r['-d'] || 'anywhere') + '   ' + r.raw.replace(/-j \S+/, '').replace(/^-p \S+ /, '').trim());
        });
        out.push('');
      });
      return out;
    }
    if (!action) return [IPT_VERSION + ': no command specified', 'Try `iptables -h\' or \'iptables --help\' for more information.'];
    if (!chain || (IPT_TABLES[table] || []).indexOf(chain) < 0) {
      return [IPT_VERSION + ': Chain "' + chain + '" does not exist in table "' + table + '"', 'Try `iptables -h\' or \'iptables --help\' for more information.'];
    }
    if (!rule.target) return [IPT_VERSION + ': Bad target: a rule needs "-j TARGET" here (ACCEPT, DROP, ...)'];
    if (rule.target === 'SYNPROXY' && table !== 'filter') return [IPT_VERSION + ': SYNPROXY is only valid in the filter table (INPUT/FORWARD)'];
    if (rule.target === 'CT' && table !== 'raw') return [IPT_VERSION + ': the CT target is only valid in the raw table'];
    if (rule.mods.indexOf('tcp') >= 0 && rule.proto !== 'tcp') return [IPT_VERSION + ': Couldn\'t load match `tcp\':the "-m tcp" module needs -p tcp'];
    rule.table = table;
    rule.chain = chain;
    rule.raw = args.filter(function (t, k) { return !(t === '-A' || t === '-t' || t === '-I' || (k > 0 && (args[k - 1] === '-A' || args[k - 1] === '-t' || args[k - 1] === '-I'))); }).join(' ');
    if (action === '-D') {
      var before = host.rules.length;
      var idx = -1;
      host.rules.forEach(function (r, k) { if (idx < 0 && r.table === table && r.chain === chain && r.raw === rule.raw) idx = k; });
      if (idx < 0) return [IPT_VERSION + ': Bad rule (does a matching rule exist in that chain?).'];
      host.rules.splice(idx, 1);
      return out;
    }
    if (action === '-I') {
      var pos = 0, seen = 0;
      for (var k = 0; k < host.rules.length; k++) {
        if (host.rules[k].table === table && host.rules[k].chain === chain) { seen++; if (seen === (insertAt || 1)) { pos = k; break; } }
        pos = k + 1;
      }
      host.rules.splice(pos, 0, rule);
    } else {
      host.rules.push(rule);
    }
    return out;
  }

  function cmdNft(host, a, line) {
    var args = a.slice(1);
    if (args[0] === 'list' && args[1] === 'ruleset') {
      var out = ['table inet filter {', '\tchain input {', '\t\ttype filter hook input priority filter; policy accept;'];
      host.rules.filter(function (r) { return r.nft; }).forEach(function (r) { out.push('\t\t' + r.raw); });
      out.push('\t}', '}');
      return out;
    }
    if (args[0] === 'add' && args[1] === 'rule') {
      var fam = args[2], tbl = args[3], ch = args[4];
      if ((fam !== 'inet' && fam !== 'ip') || tbl !== 'filter' || ch !== 'input') {
        return ['Error: No such file or directory', 'add rule ' + args.slice(2).join(' ') + '\n         ^^^^^^^^^^^^^^^^^^'.replace(/\n/g, ' ')];
      }
      var rest = args.slice(5).join(' ');
      var syn = /tcp flags\s+(?:&\s*\S+\s*==\s*)?syn\b/.test(rest) || /tcp flags\s*&\s*syn\s*==\s*syn/.test(rest);
      var over = /limit rate over (\d+)\/(second|minute|hour)/.exec(rest);
      var lim = /limit rate (\d+)\/(second|minute|hour)/.exec(rest);
      var act = /\b(drop|reject|accept)\b/.exec(rest);
      if (!act || !/tcp/.test(rest)) return ['Error: syntax error, unexpected end of file', 'add rule ' + args.slice(2).join(' ')];
      var conv = function (m) { return m ? (m[2] === 'second' ? 1 : (m[2] === 'minute' ? 1 / 60 : 1 / 3600)) * parseInt(m[1], 10) : null; };
      host.rules.push({
        nft: true, table: 'filter', chain: 'INPUT', mods: [], target: act[1].toUpperCase(), action: act[1],
        syn: syn, overRate: over ? conv(over) : null, limitRate: !over && lim ? conv(lim) : null,
        perSource: /saddr/.test(rest) || /meter|ct count/.test(rest), raw: rest
      });
      return [];
    }
    if (args[0] === 'flush') { host.rules = host.rules.filter(function (r) { return !r.nft; }); return []; }
    return ['Error: syntax error, unexpected ' + (args[0] || 'end of file'), 'Supported here: nft list ruleset | nft add rule inet filter input ... | nft flush ruleset'];
  }

  function cmdIpset(host, a) {
    var args = a.slice(1);
    if (args[0] === 'create' && args[1]) { host.ipsets[args[1]] = []; return []; }
    if (args[0] === 'add' && args[1]) {
      if (!host.ipsets[args[1]]) return ['ipset v7.15: The set with the given name does not exist'];
      host.ipsets[args[1]].push(args[2]); return [];
    }
    if (args[0] === 'list') return Object.keys(host.ipsets).map(function (k) { return 'Name: ' + k + ' (' + host.ipsets[k].length + ' entries)'; });
    return ['ipset v7.15: Unknown command'];
  }

  var HELP = [
    'Supported commands (the lab simulates a Linux host; nothing real is changed):',
    '  measure   ss -tan state syn-recv | wc -l      netstat -ant | grep -c SYN_RECV',
    '            ss -s       netstat -s | grep -i listen       dmesg | tail',
    '            tcpdump -nn -c 10 \'tcp[tcpflags] == tcp-syn\'        curl -I --max-time 5 https://shop.example/',
    '  kernel    sysctl <key>      sysctl -w <key>=<value>      sysctl -a | grep syn',
    '            sysctl --system   sysctl -p <file>',
    '            cat /etc/sysctl.d/99-synflood.conf      echo "<line>" >> /etc/sysctl.d/99-synflood.conf',
    '  firewall  iptables -L -n -v      iptables -S      iptables -A INPUT ...      iptables -F',
    '            nft list ruleset       nft add rule inet filter input ...',
    '            ipset create <name> hash:ip     ipset add <name> <address>',
    '  filters   | grep [-i -v -c]     | wc -l     | head -n N     | tail -n N     | tee [-a] <file>',
    '  other     clear   hostname   whoami   uname -a   date',
    'Keys you can tune: ' + SYSCTL_ORDER.join(', ')
  ];

  // ---- stages and pipelines -------------------------------------------------------
  function sourceStage(host, tokens, ctx) {
    var cmd = tokens[0];
    if (cmd === 'sudo') return sourceStage(host, tokens.slice(1), ctx);
    switch (cmd) {
      case 'help': case '?': return HELP.slice();
      case 'clear': ctx.clear = true; return [];
      case 'hostname': return ['web01'];
      case 'whoami': return ['root'];
      case 'id': return ['uid=0(root) gid=0(root) groups=0(root)'];
      case 'date': return ['Tue Oct 13 02:21:44 UTC 2026'];
      case 'uname': return BASE_LINES.slice();
      case 'pwd': return ['/root'];
      case 'uptime': return [' 02:21:44 up 38 days,  3:12,  1 user,  load average: 0.31, 0.42, 0.40'];
      case 'ls': {
        var tgt = tokens.slice(1).filter(function (t) { return t[0] !== '-'; })[0] || '.';
        if (tgt.replace(/\/$/, '') === '/etc/sysctl.d') return Object.keys(host.files).filter(function (f) { return f.indexOf('/etc/sysctl.d/') === 0; }).map(function (f) { return f.split('/').pop(); });
        return tgt === '.' ? [] : ['ls: cannot access \'' + tgt + '\': Not available in this lab'];
      }
      case 'cat': {
        var f = tokens[1];
        if (!f) return [];
        if (f in host.files) return host.files[f] ? host.files[f].replace(/\n$/, '').split('\n') : [];
        var m = /^\/proc\/sys\/(.+)$/.exec(f);
        if (m) { var key = m[1].replace(/\//g, '.'); return key in host.sysctl ? [String(host.sysctl[key])] : ['cat: ' + f + ': No such file or directory']; }
        return ['cat: ' + f + ': No such file or directory'];
      }
      case 'echo': {
        var redirect = null, append = false, words = [];
        for (var i = 1; i < tokens.length; i++) {
          var t = tokens[i];
          if (t === '>>' || t === '>') { redirect = tokens[++i]; append = t === '>>'; }
          else if (t.indexOf('>>') === 0) { redirect = t.slice(2); append = true; }
          else if (t[0] === '>') { redirect = t.slice(1); append = false; }
          else words.push(t);
        }
        var text = words.join(' ');
        if (redirect) { var err = writeFile(host, redirect, text, append); return err ? [err] : []; }
        return [text];
      }
      case 'sysctl': return cmdSysctl(host, tokens);
      case 'ss': host.ran.count = host.ran.count || tokens.some(function (t) { return /syn-recv|syn_recv/i.test(t); }); return ssLines(host, tokens.slice(1));
      case 'netstat': {
        var items = netstatLines(host, tokens.slice(1));
        if (tokens.indexOf('-s') < 0 && !tokens.some(function (t) { return /^-[a-z]*s$/.test(t); })) { /* counted when it is filtered for SYN_RECV */ ctx.netstatTable = true; }
        return items;
      }
      case 'dmesg': host.ran.klog = true; return dmesgLines(host);
      case 'journalctl': if (tokens.some(function (t) { return t === '-k' || t === '--dmesg'; })) { host.ran.klog = true; return dmesgLines(host); } return ['-- No entries --'];
      case 'tcpdump': host.ran.capture = true; return tcpdumpLines(host, tokens.slice(1));
      case 'curl': return curlLines(host);
      case 'iptables': case 'ip6tables': return cmdIptables(host, tokens);
      case 'nft': return cmdNft(host, tokens);
      case 'ipset': return cmdIpset(host, tokens);
      case 'awk': case 'sed': case 'sort': case 'uniq': case 'cut': case 'top': case 'htop': case 'ping':
        return [cmd + ': not available in this lab shell. Try grep, wc, head or tail.'];
      default:
        return ['bash: ' + cmd + ': command not found. Type "help" to see what this lab supports.'];
    }
  }

  function filterStage(host, tokens, input) {
    var cmd = tokens[0];
    if (cmd === 'grep') {
      var flags = tokens.slice(1).filter(function (t) { return /^-[a-zA-Z]+$/.test(t); }).join('');
      var rest = tokens.slice(1).filter(function (t) { return !/^-[a-zA-Z]+$/.test(t); });
      var pat = rest[0];
      if (pat === undefined) return { err: 'Usage: grep [OPTION]... PATTERNS' };
      var ci = /i/.test(flags), inv = /v/.test(flags), cnt = /c/.test(flags), ext = /E/.test(flags);
      var re;
      try { re = new RegExp(ext ? pat : pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ci ? 'i' : ''); } catch (e) { return { err: 'grep: Invalid regular expression' }; }
      var kept = [];
      input.forEach(function (it) {
        var n = itemCount(it);
        var hit = re.test(itemText(it, 0));
        if (typeof it !== 'string' && n > 1) { if (hit !== inv) kept.push(it); }   // a group is homogeneous
        else if (hit !== inv) kept.push(it);
      });
      return { items: cnt ? [String(totalLines(kept))] : kept };
    }
    if (cmd === 'wc') {
      if (tokens.indexOf('-l') < 0) return { err: 'wc: only "wc -l" is supported in this lab' };
      return { items: [String(totalLines(input))] };
    }
    if (cmd === 'head' || cmd === 'tail') {
      var k = 10;
      for (var i = 1; i < tokens.length; i++) {
        if (tokens[i] === '-n') k = parseInt(tokens[i + 1], 10) || 10;
        else if (/^-\d+$/.test(tokens[i])) k = parseInt(tokens[i].slice(1), 10);
      }
      return { items: cmd === 'head' ? takeHead(input, k) : takeTail(input, k) };
    }
    if (cmd === 'tee') {
      var app = tokens.indexOf('-a') >= 0;
      var file = tokens.filter(function (t, j) { return j > 0 && t[0] !== '-'; })[0];
      var lines = [];
      input.forEach(function (it) { for (var j = 0; j < Math.min(itemCount(it), 50); j++) lines.push(itemText(it, j)); });
      if (file) {
        var allowed = file === '/etc/sysctl.conf' || /^\/etc\/sysctl\.d\/[A-Za-z0-9._-]+\.conf$/.test(file);
        if (!allowed) return { err: 'tee: ' + file + ': Read-only in this lab (use /etc/sysctl.d/99-synflood.conf)' };
        lines.forEach(function (l, j) { writeFile(host, file, l, app || j > 0); });
      }
      return { items: input };
    }
    return { err: 'bash: ' + cmd + ': pipelines in this lab support grep, wc -l, head, tail and tee' };
  }

  // Runs one command line. Returns { lines: [display strings], clear: bool }.
  function run(host, line) {
    host.cmdCount++;
    var raw = String(line || '').trim();
    if (!raw) return { lines: [], clear: false };
    var stages = splitPipes(raw);
    if (!stages) return { lines: ['bash: unexpected EOF while looking for matching quote'], clear: false };
    var ctx = { clear: false };
    var items = null;
    for (var s = 0; s < stages.length; s++) {
      var toks = tokenize(stages[s]);
      if (!toks.length) return { lines: ['bash: syntax error near unexpected token `|\''], clear: false };
      if (s === 0) {
        items = sourceStage(host, toks, ctx);
        if (ctx.netstatTable && stages.length > 1 && stages.slice(1).some(function (st) { return /SYN_RECV/.test(st); })) host.ran.count = true;
      } else {
        var r = filterStage(host, toks, items);
        if (r.err) return { lines: [r.err], clear: false };
        items = r.items;
      }
    }
    var out = [];
    items.forEach(function (it) {
      if (typeof it === 'string') { out.push(it); return; }
      var show = Math.min(it.n, 6);
      for (var i = 0; i < show; i++) out.push(it.gen(i));
      if (it.n > show) out.push('... (' + (it.n - show) + ' more lines like these not shown)');
    });
    return { lines: out, clear: ctx.clear };
  }

  // ---- shell test hooks and the public pure API ----------------------------------------
  var shell = {
    createHost: createHost,
    run: run,
    evaluate: evaluate,
    attackModel: attackModel,
    parseConf: parseConf
  };

  // =========================================================================
  // 2. WORKSHOP UI
  // =========================================================================
  var W;                                  // Lab.Content.workshop
  var root = null;
  var opts = {};
  var host = null;
  var done = {};                          // module id -> true
  var tasksDone = {};                     // harden task id -> true
  var testEngine = null;
  var offTerminal = null;
  var testRunning = false;
  var finishedFired = false;
  var currentTab = 'understand';
  var incidentState = null;
  var scores = { incidentFirstTry: 0, incidentTotal: 0, layersFirstTry: 0, layersTotal: 0 };

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function $(id) { return document.getElementById(id); }

  function inline(parent, text) {
    var re = /(\*\*[^*]+\*\*|`[^`]+`)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      var tok = m[0];
      if (tok[0] === '*') parent.appendChild(el('strong', null, tok.slice(2, -2)));
      else parent.appendChild(el('code', null, tok.slice(1, -1)));
      last = m.index + tok.length;
    }
    if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
    return parent;
  }

  function renderBlocks(container, blocks) {
    blocks.forEach(function (b) {
      var n;
      if (b.t === 'h') n = el('h4', 'ws-h', b.x);
      else if (b.t === 'p') n = inline(el('p'), b.x);
      else if (b.t === 'ul' || b.t === 'ol') { n = el(b.t, 'ws-list'); b.items.forEach(function (it) { n.appendChild(inline(el('li'), it)); }); }
      else if (b.t === 'code') { n = el('pre', 'ws-code'); n.appendChild(el('code', null, b.x)); n.tabIndex = 0; }
      else if (b.t === 'note') { n = el('aside', 'ws-note'); n.appendChild(el('strong', 'ws-note__title', b.title)); n.appendChild(inline(el('p'), b.x)); }
      else if (b.t === 'table') {
        var wrap = el('div', 'ws-table-wrap'); wrap.tabIndex = 0;
        var tb = el('table', 'ws-table');
        var thead = el('thead'), hr = el('tr');
        b.head.forEach(function (h) { var th = el('th', null, h); th.scope = 'col'; hr.appendChild(th); });
        thead.appendChild(hr); tb.appendChild(thead);
        var tbody = el('tbody');
        b.rows.forEach(function (r) { var tr = el('tr'); r.forEach(function (c, ci) { var td = el(ci === 0 ? 'th' : 'td'); if (ci === 0) td.scope = 'row'; inline(td, c); tr.appendChild(td); }); tbody.appendChild(tr); });
        tb.appendChild(tbody); wrap.appendChild(tb); n = wrap;
      }
      if (n) container.appendChild(n);
    });
  }

  // ---- multiple-choice questions ----------------------------------------------------------
  function renderQuestions(container, questions, onAllDone, tally) {
    var solved = 0;
    questions.forEach(function (q, qi) {
      var card = el('fieldset', 'ws-q');
      var legend = el('legend', null, (qi + 1) + '. ' + q.question);
      card.appendChild(legend);
      var group = el('div', 'ws-q__options');
      group.setAttribute('role', 'group');
      var fb = el('div', 'ws-feedback');
      fb.setAttribute('role', 'status');
      var wrongTries = 0;
      var opts_ = [];
      q.options.forEach(function (text, i) {
        var b = el('button', 'quiz-option');
        b.type = 'button';
        b.appendChild(el('span', 'quiz-option__key', String.fromCharCode(65 + i))).setAttribute('aria-hidden', 'true');
        b.appendChild(el('span', 'quiz-option__text', text));
        b.addEventListener('click', function () {
          if (i === q.answer) {
            b.classList.add('is-correct');
            opts_.forEach(function (o) { o.disabled = true; });
            fb.textContent = '';
            fb.className = 'ws-feedback is-good';
            fb.appendChild(el('strong', null, 'Correct. '));
            fb.appendChild(document.createTextNode(q.explanation));
            if (tally && wrongTries === 0) tally.first++;
            solved++;
            if (solved === questions.length) onAllDone();
          } else {
            wrongTries++;
            b.classList.add('is-wrong');
            b.disabled = true;
            fb.className = 'ws-feedback is-bad';
            fb.textContent = 'Not quite. Re-read the evidence and try another option.';
          }
        });
        opts_.push(b);
        group.appendChild(b);
      });
      card.appendChild(group);
      card.appendChild(fb);
      container.appendChild(card);
    });
  }

  // ---- module panels ------------------------------------------------------------------------
  function panelUnderstand(p) {
    var U = W.understand;
    renderBlocks(p, U.blocks);

    var calc = el('div', 'ws-calc');
    calc.appendChild(el('h4', 'ws-h', U.calculator.title));
    calc.appendChild(inline(el('p'), U.calculator.text));
    var row = el('div', 'ws-calc__row');
    var label = el('label', null, 'tcp_synack_retries = ');
    label.htmlFor = 'ws-calc-input';
    var input = el('input', 'field');
    input.type = 'number'; input.id = 'ws-calc-input'; input.min = '0'; input.max = '10'; input.inputMode = 'numeric';
    var btn = el('button', 'btn btn--primary', 'Check');
    btn.type = 'button'; btn.id = 'ws-calc-check';
    row.appendChild(label); row.appendChild(input); row.appendChild(btn);
    calc.appendChild(row);
    var fb = el('div', 'ws-feedback'); fb.setAttribute('role', 'status'); fb.id = 'ws-calc-feedback';
    calc.appendChild(fb);
    p.appendChild(calc);

    var calcOk = false, cpOk = false;
    function maybe() { if (calcOk && cpOk) markDone('understand'); }
    btn.addEventListener('click', function () {
      var v = parseInt(input.value, 10);
      fb.textContent = '';
      if (v === U.calculator.answer) {
        calcOk = true; fb.className = 'ws-feedback is-good';
        fb.appendChild(el('strong', null, 'Correct. ')); fb.appendChild(document.createTextNode(U.calculator.success + ' '));
        fb.appendChild(document.createTextNode(U.calculator.caveat));
        maybe();
      } else if (isNaN(v)) { fb.className = 'ws-feedback is-bad'; fb.textContent = 'Enter a whole number.'; }
      else {
        var life = Math.pow(2, v + 1) - 1;
        fb.className = 'ws-feedback is-bad';
        fb.textContent = 'With ' + v + ' retries an entry lives ' + life + ' s, so the queue wants ' + (U.calculator.rate * life).toLocaleString('en-US') + ' entries (backlog ' + U.calculator.backlog.toLocaleString('en-US') + '). ' + U.calculator.failure;
      }
    });

    p.appendChild(el('h4', 'ws-h', 'Checkpoint questions'));
    var qs = el('div', 'ws-qs');
    renderQuestions(qs, U.checkpoints, function () { cpOk = true; maybe(); });
    p.appendChild(qs);
  }

  function panelInvestigate(p) {
    var I = W.investigate;
    p.appendChild(inline(el('p'), I.brief));
    var ev = el('div', 'ws-evidence');
    I.evidence.forEach(function (e) {
      var card = el('figure', 'ws-evidence__card');
      card.appendChild(el('figcaption', null, e.title));
      var pre = el('pre', 'ws-code'); pre.tabIndex = 0;
      pre.appendChild(el('code', null, e.lines.join('\n')));
      card.appendChild(pre);
      ev.appendChild(card);
    });
    p.appendChild(ev);
    p.appendChild(el('h4', 'ws-h', 'Your diagnosis'));
    var qs = el('div', 'ws-qs');
    renderQuestions(qs, I.questions, function () { markDone('investigate'); });
    p.appendChild(qs);
  }

  function panelLayers(p) {
    var L = W.layers;
    p.appendChild(inline(el('p'), L.brief));
    var grid = el('div', 'ws-layers');
    L.layers.forEach(function (l, i) {
      var c = el('div', 'ws-layer');
      c.appendChild(el('span', 'ws-layer__num', String(i + 1)));
      c.appendChild(el('strong', null, l.name));
      c.appendChild(el('p', null, l.text));
      grid.appendChild(c);
    });
    p.appendChild(grid);
    p.appendChild(el('h4', 'ws-h', 'Match each situation to the best layer'));
    var solved = 0;
    L.exercises.forEach(function (ex, idx) {
      var card = el('div', 'ws-q ws-match');
      var id = 'ws-match-' + ex.id;
      var lab = el('label', 'ws-match__text'); lab.htmlFor = id;
      lab.textContent = (idx + 1) + '. ' + ex.situation;
      var sel = el('select', 'field'); sel.id = id;
      var ph = el('option', null, 'Choose a layer...'); ph.value = ''; sel.appendChild(ph);
      L.layers.forEach(function (l) { var o = el('option', null, l.name); o.value = l.id; sel.appendChild(o); });
      var fb = el('div', 'ws-feedback'); fb.setAttribute('role', 'status');
      var wrong = 0, locked = false;
      sel.addEventListener('change', function () {
        if (locked || !sel.value) return;
        if (sel.value === ex.answer) {
          locked = true; sel.disabled = true;
          fb.className = 'ws-feedback is-good'; fb.textContent = '';
          fb.appendChild(el('strong', null, 'Correct. ')); fb.appendChild(document.createTextNode(ex.explanation));
          scores.layersTotal++; if (wrong === 0) scores.layersFirstTry++;
          solved++;
          if (solved === L.exercises.length) {
            var closing = inline(el('p', 'ws-closing'), L.closing);
            p.appendChild(closing);
            markDone('layers');
          }
        } else {
          wrong++;
          fb.className = 'ws-feedback is-bad';
          fb.textContent = 'Not the best fit. Think about where the bottleneck is and who has the capacity to fix it.';
        }
      });
      card.appendChild(lab); card.appendChild(sel); card.appendChild(fb);
      p.appendChild(card);
    });
  }

  function panelIncident(p) {
    var N = W.incident;
    p.appendChild(inline(el('p'), N.brief));
    var stage = el('div', 'ws-incident'); stage.id = 'ws-incident';
    p.appendChild(stage);
    incidentState = { i: 0, first: 0, wrong: 0 };
    renderIncidentStep(stage);
  }

  function renderIncidentStep(stage) {
    var N = W.incident, st = incidentState;
    stage.textContent = '';
    if (st.i >= N.steps.length) {
      var res = el('div', 'ws-incident__result');
      res.appendChild(el('h4', 'ws-h', 'Incident closed'));
      res.appendChild(el('p', null, 'First-try decisions: ' + st.first + ' of ' + N.steps.length + '.'));
      res.appendChild(inline(el('p'), N.debrief));
      stage.appendChild(res);
      scores.incidentFirstTry = st.first; scores.incidentTotal = N.steps.length;
      markDone('incident');
      return;
    }
    var s = N.steps[st.i];
    var card = el('div', 'ws-incident__card');
    card.appendChild(el('p', 'ws-incident__meta', 'Decision ' + (st.i + 1) + ' of ' + N.steps.length + ' — ' + s.title));
    card.appendChild(el('p', 'ws-incident__situation', s.situation));
    var group = el('div', 'ws-q__options'); group.setAttribute('role', 'group');
    var fb = el('div', 'ws-feedback'); fb.setAttribute('role', 'status');
    var next = el('button', 'btn btn--primary', st.i === N.steps.length - 1 ? 'Close the incident' : 'Next decision');
    next.type = 'button'; next.hidden = true; next.id = 'ws-incident-next';
    var wrong = 0, opts_ = [];
    s.options.forEach(function (o, i) {
      var b = el('button', 'quiz-option'); b.type = 'button';
      b.appendChild(el('span', 'quiz-option__key', String.fromCharCode(65 + i))).setAttribute('aria-hidden', 'true');
      b.appendChild(el('span', 'quiz-option__text', o.text));
      b.addEventListener('click', function () {
        fb.textContent = '';
        if (o.good) {
          b.classList.add('is-correct'); opts_.forEach(function (x) { x.disabled = true; });
          fb.className = 'ws-feedback is-good'; fb.appendChild(el('strong', null, 'Good call. ')); fb.appendChild(document.createTextNode(o.why));
          if (wrong === 0) st.first++;
          next.hidden = false; next.focus();
        } else {
          wrong++; b.classList.add('is-wrong'); b.disabled = true;
          fb.className = 'ws-feedback is-bad'; fb.appendChild(el('strong', null, 'Weak choice. ')); fb.appendChild(document.createTextNode(o.why));
        }
      });
      opts_.push(b); group.appendChild(b);
    });
    next.addEventListener('click', function () { st.i++; renderIncidentStep(stage); var h = stage.querySelector('.ws-incident__meta, .ws-h'); if (h) { h.tabIndex = -1; h.focus(); } });
    card.appendChild(group); card.appendChild(fb); card.appendChild(next);
    stage.appendChild(card);
  }

  // ---- terminal + hardening -------------------------------------------------------------------
  function panelHarden(p) {
    var H = W.harden;
    p.appendChild(el('div', 'ws-story', W.scenario.story));
    p.appendChild(inline(el('p'), H.brief));

    var lay = el('div', 'ws-harden');
    var opener = el('div', 'ws-opener');
    opener.appendChild(el('p', null, 'The terminal is a pop-up panel that is available throughout the lab. Open it, type real commands, and the checklist below ticks itself.'));
    var ob = el('button', 'btn btn--primary', 'Open the terminal'); ob.type = 'button'; ob.id = 'btn-ws-open-terminal';
    ob.addEventListener('click', function () { Lab.Terminal.open(true); });
    opener.appendChild(ob);
    lay.appendChild(opener);

    // checklist
    var side = el('div', 'ws-side');
    side.appendChild(el('h4', 'ws-h', 'Your checklist'));
    var list = el('ol', 'ws-tasks'); list.id = 'ws-tasks';
    H.tasks.forEach(function (t) {
      var li = el('li', 'ws-task'); li.id = 'ws-task-' + t.id; li.setAttribute('data-done', 'false');
      var head = el('div', 'ws-task__head');
      head.appendChild(el('span', 'ws-task__tick', ''));
      var title = el('span', 'ws-task__title', t.title); head.appendChild(title);
      head.appendChild(el('span', 'ws-task__tag' + (t.required ? '' : ' is-optional'), t.required ? 'Required' : 'Optional'));
      li.appendChild(head);
      li.appendChild(inline(el('p', 'ws-task__why'), t.why));
      var hb = el('button', 'btn btn--ghost btn--sm', 'Show hint'); hb.type = 'button';
      var hint = el('pre', 'ws-hint'); hint.hidden = true; hint.appendChild(el('code', null, t.hint));
      hb.addEventListener('click', function () { hint.hidden = !hint.hidden; hb.textContent = hint.hidden ? 'Show hint' : 'Hide hint'; });
      li.appendChild(hb); li.appendChild(hint);
      list.appendChild(li);
    });
    side.appendChild(list);
    lay.appendChild(side);
    p.appendChild(lay);

    // test
    var test = el('div', 'ws-test');
    test.appendChild(el('h4', 'ws-h', 'Test your hardening'));
    test.appendChild(el('p', null, 'This replays your attack from Part 1 against web01 twice: first as it was before you touched it, then with the configuration you built in the terminal.'));
    var trow = el('div', 'ws-test__row');
    var tb = el('button', 'btn btn--primary', 'Test the hardened server'); tb.type = 'button'; tb.id = 'btn-ws-test';
    var tl = el('span', 'ws-test__status', ''); tl.id = 'ws-test-status'; tl.setAttribute('role', 'status');
    trow.appendChild(tb); trow.appendChild(tl);
    test.appendChild(trow);
    var res = el('div', 'ws-result'); res.id = 'ws-test-result'; res.hidden = true;
    test.appendChild(res);
    p.appendChild(test);

    renderBlocks(p, H.reference);

    // wiring
    tb.addEventListener('click', runHardeningTest);
    updateTasks();
  }

  function taskChecks() {
    var ev = evaluate(host), s = ev.status;
    var conf = parseConf(host.files['/etc/sysctl.d/99-synflood.conf']);
    var confCookies = conf['net.ipv4.tcp_syncookies'], confRetries = conf['net.ipv4.tcp_synack_retries'];
    return {
      count: host.ran.count,
      klog: host.ran.klog,
      capture: host.ran.capture,
      cookies: s.cookies >= 1,
      retries: s.retries >= 1 && s.retries <= 3,
      backlog: s.backlog >= 2048 && s.somaxconn >= 2048,
      ratelimit: !!s.globalLimit && !s.lowLimit,
      persist: confCookies >= 1 && confRetries >= 1 && confRetries <= 3 && host.loadedVersion === host.fileVersion,
      synproxy: s.synproxyActive
    };
  }

  function updateTasks() {
    if (!host || !$('ws-tasks')) return;
    var chk = taskChecks();
    W.harden.tasks.forEach(function (t) {
      if (chk[t.id]) tasksDone[t.id] = true;
      var li = $('ws-task-' + t.id);
      if (li) {
        li.setAttribute('data-done', tasksDone[t.id] ? 'true' : 'false');
        var tick = li.querySelector('.ws-task__tick');
        if (tick) tick.textContent = tasksDone[t.id] ? '✓' : '';
      }
    });
    checkHardenDone();
  }

  function requiredTasksDone() {
    return W.harden.tasks.every(function (t) { return !t.required || tasksDone[t.id]; });
  }

  function checkHardenDone() {
    if (requiredTasksDone() && host.lastTest && host.lastTest.pass) markDone('harden');
  }

  function simulate(defences, level, cb) {
    var e = Lab.Engine.create({ tickMs: 8 });
    testEngine = e;
    e.setMitigation(defences);
    e.on('runEnded', function (summary) {
      var h = e.getState().history.filter(function (x) { return x.t >= 10; });
      var steady = h.length ? h.reduce(function (a, x) { return a + x.availability; }, 0) / h.length : 0;
      testEngine = null;
      cb({ steady: Math.round(steady * 10) / 10, state: summary.finalServerState, peakCpu: summary.peakCpu, avgResponseTimeMs: summary.avgResponseTimeMs, stoppedEarly: !!summary.stoppedEarly });
    });
    e.runAttack(level);
  }

  function runHardeningTest() {
    if (testRunning) return;
    var level = (opts.getLevel && opts.getLevel()) || 'medium';
    host.level = level;
    var ev = evaluate(host);
    var none = { synCookies: false, rateLimit: false, shortTimeout: false, firewall: false };
    testRunning = true;
    $('btn-ws-test').disabled = true;
    $('ws-test-status').textContent = 'Replaying the ' + level + ' attack against web01...';
    simulate(none, level, function (before) {
      if (before.stoppedEarly) return;
      simulate(ev.defences, level, function (after) {
        if (after.stoppedEarly) return;
        testRunning = false;
        $('btn-ws-test').disabled = false;
        $('ws-test-status').textContent = 'Test finished.';
        var okState = after.state === 'Healthy' || after.state === 'Under Pressure';
        var pass = !ev.blocksCustomers && after.steady >= 95 && okState;
        host.lastTest = { level: level, before: before, after: after, pass: pass, excellent: pass && after.state === 'Healthy', defences: ev.defences };
        showTestResult(ev);
        checkHardenDone();
      });
    });
  }

  function showTestResult(ev) {
    var box = $('ws-test-result'), R = W.harden.results, t = host.lastTest;
    box.hidden = false; box.textContent = '';
    box.className = 'ws-result ' + (t.pass ? (t.excellent ? 'is-excellent' : 'is-pass') : 'is-fail');
    var title = t.pass ? (t.excellent ? 'Excellent: the server is Healthy' : 'Pass: customers are served') : 'Not yet';
    box.appendChild(el('h4', 'ws-result__title', title));
    box.appendChild(el('p', null, t.pass ? (t.excellent ? R.pass : R.weak) : (ev.blocksCustomers ? 'Your SYN limit is blocking genuine customers. ' + R.fail : R.fail)));
    var tb = el('table', 'ws-table ws-result__table');
    var head = el('thead'), hr = el('tr');
    ['', 'Before (as found)', 'After (your config)'].forEach(function (h) { var th = el('th', null, h); th.scope = 'col'; hr.appendChild(th); });
    head.appendChild(hr); tb.appendChild(head);
    var body = el('tbody');
    [['Level of attack', t.level, t.level],
     ['Customer availability', t.before.steady + '%', t.after.steady + '%'],
     ['Server state', t.before.state, t.after.state],
     ['Peak CPU', Math.round(t.before.peakCpu) + '%', Math.round(t.after.peakCpu) + '%'],
     ['Average response time', Math.round(t.before.avgResponseTimeMs) + ' ms', Math.round(t.after.avgResponseTimeMs) + ' ms']].forEach(function (r) {
      var tr = el('tr'); r.forEach(function (c, i) { var cell = el(i === 0 ? 'th' : 'td', null, c); if (i === 0) cell.scope = 'row'; tr.appendChild(cell); }); body.appendChild(tr);
    });
    tb.appendChild(body);
    var wrap = el('div', 'ws-table-wrap'); wrap.tabIndex = 0; wrap.appendChild(tb);
    box.appendChild(wrap);
    box.appendChild(el('h5', 'ws-h', 'What your configuration did'));
    var ul = el('ul', 'ws-notes');
    ev.notes.forEach(function (n) { var li = el('li', 'ws-notes__' + n.level); li.appendChild(el('span', 'ws-notes__icon', { good: '✓', warn: '!', bad: '✗', info: 'i' }[n.level])); li.appendChild(document.createTextNode(' ' + n.text)); ul.appendChild(li); });
    box.appendChild(ul);
    var pend = W.harden.tasks.filter(function (x) { return x.required && !tasksDone[x.id]; });
    if (t.pass && pend.length) box.appendChild(el('p', 'ws-result__pending', 'The test passed, but these required checklist items are still open: ' + pend.map(function (x) { return x.title; }).join('; ') + '.'));
  }

  // ---- tabs and progress --------------------------------------------------------------------------
  function markDone(id) {
    if (done[id]) return;
    done[id] = true;
    updateTabs();
  }

  function allDone() { return W.modules.every(function (m) { return done[m.id]; }); }

  function updateTabs() {
    if (!root) return;
    var n = 0;
    W.modules.forEach(function (m) {
      var tab = $('ws-tab-' + m.id);
      if (!tab) return;
      var ok = !!done[m.id];
      if (ok) n++;
      tab.setAttribute('data-done', ok ? 'true' : 'false');
      var tick = tab.querySelector('.ws-tab__tick');
      if (tick) tick.textContent = ok ? '✓' : '';
    });
    var prog = $('workshop-progress');
    if (prog) prog.textContent = n + ' of ' + W.modules.length + ' modules complete';
    var bar = document.querySelector('#workshop-progress-bar');
    if (bar) bar.style.width = (n / W.modules.length * 100) + '%';
    var fin = $('workshop-finish');
    if (fin) {
      fin.hidden = !allDone();
      if (allDone() && !fin.getAttribute('data-announced')) {
        fin.setAttribute('data-announced', '1');
        var live = $('workshop-live'); if (live) live.textContent = W.completion.title + '. You can continue to the quiz.';
      }
    }
  }

  function selectTab(id, focus) {
    currentTab = id;
    W.modules.forEach(function (m) {
      var tab = $('ws-tab-' + m.id), panel = $('ws-panel-' + m.id);
      var on = m.id === id;
      if (tab) { tab.setAttribute('aria-selected', on ? 'true' : 'false'); tab.tabIndex = on ? 0 : -1; }
      if (panel) panel.hidden = !on;
    });
    if (id === 'harden' && Lab.Terminal && root && root.offsetParent !== null) Lab.Terminal.open(false);
    if (focus && $('ws-tab-' + id)) $('ws-tab-' + id).focus();
  }

  function build() {
    root.textContent = '';
    var intro = el('p', 'ws-intro'); intro.id = 'workshop-intro'; intro.textContent = W.intro;
    root.appendChild(intro);

    var prog = el('div', 'ws-progress');
    var label = el('span', 'ws-progress__label', ''); label.id = 'workshop-progress';
    var track = el('div', 'progress'); track.setAttribute('aria-hidden', 'true');
    var barEl = el('div', 'progress__bar'); barEl.id = 'workshop-progress-bar'; track.appendChild(barEl);
    prog.appendChild(label); prog.appendChild(track);
    root.appendChild(prog);

    var tabs = el('div', 'ws-tabs'); tabs.setAttribute('role', 'tablist'); tabs.id = 'workshop-tabs'; tabs.setAttribute('aria-label', 'Workshop modules');
    var panels = el('div', 'ws-panels'); panels.id = 'workshop-panels';
    W.modules.forEach(function (m, idx) {
      var tab = el('button', 'ws-tab'); tab.type = 'button'; tab.id = 'ws-tab-' + m.id;
      tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', 'ws-panel-' + m.id); tab.setAttribute('aria-selected', 'false'); tab.tabIndex = -1;
      tab.appendChild(el('span', 'ws-tab__num', String(idx + 1)));
      var txt = el('span', 'ws-tab__text'); txt.appendChild(el('strong', null, m.title)); txt.appendChild(el('small', null, m.blurb)); tab.appendChild(txt);
      tab.appendChild(el('span', 'ws-tab__tick', ''));
      tab.addEventListener('click', function () { selectTab(m.id, false); });
      tab.addEventListener('keydown', function (e) {
        var k = W.modules.findIndex(function (x) { return x.id === m.id; }), nx = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nx = (k + 1) % W.modules.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nx = (k - 1 + W.modules.length) % W.modules.length;
        else if (e.key === 'Home') nx = 0; else if (e.key === 'End') nx = W.modules.length - 1;
        if (nx >= 0) { e.preventDefault(); selectTab(W.modules[nx].id, true); }
      });
      tabs.appendChild(tab);

      var panel = el('div', 'ws-panel'); panel.id = 'ws-panel-' + m.id; panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', 'ws-tab-' + m.id); panel.hidden = true;
      panel.tabIndex = -1;
      panels.appendChild(panel);
    });
    root.appendChild(tabs);
    root.appendChild(panels);

    panelUnderstand($('ws-panel-understand'));
    panelInvestigate($('ws-panel-investigate'));
    panelHarden($('ws-panel-harden'));
    panelLayers($('ws-panel-layers'));
    panelIncident($('ws-panel-incident'));

    var foot = el('div', 'ws-foot');
    var live = el('p', 'ws-live'); live.id = 'workshop-live'; live.setAttribute('role', 'status');
    var fin = el('button', 'btn btn--primary', 'Finish the workshop and continue to the quiz'); fin.type = 'button'; fin.id = 'workshop-finish'; fin.hidden = true;
    fin.addEventListener('click', function () {
      if (!allDone() || finishedFired) return;
      finishedFired = true;
      if (typeof opts.onFinished === 'function') opts.onFinished(Lab.Workshop.getSummary());
    });
    foot.appendChild(live); foot.appendChild(fin);
    root.appendChild(foot);

    selectTab(currentTab, false);
    updateTabs();
  }

  Lab.Workshop = {
    shell: shell,
    renderBlocks: renderBlocks,

    init: function (rootEl, options) {
      W = Lab.Content.workshop;
      root = rootEl;
      opts = options || {};
      host = Lab.Terminal.getHost();
      if (offTerminal) offTerminal();
      offTerminal = Lab.Terminal.on(function () { updateTasks(); });
      done = {}; tasksDone = {}; finishedFired = false; testRunning = false;
      scores = { incidentFirstTry: 0, incidentTotal: 0, layersFirstTry: 0, layersTotal: 0 };
      currentTab = 'understand';
      if (root) build();
    },

    reset: function () {
      if (testEngine) { testEngine.stop(); testEngine = null; }
      if (!root) return;
      Lab.Workshop.init(root, opts);
    },

    isComplete: function () { return !!(W && allDone()); },
    getHost: function () { return host; },

    getSummary: function () {
      var t = host && host.lastTest;
      return {
        hardening: t ? { level: t.level, before: t.before.steady, after: t.after.steady, state: t.after.state, pass: t.pass, excellent: t.excellent } : null,
        incident: { firstTry: scores.incidentFirstTry, total: scores.incidentTotal },
        layers: { firstTry: scores.layersFirstTry, total: scores.layersTotal },
        modulesDone: Object.keys(done).length
      };
    },

    // test hook: finish every module without clicking (used only by tests/e2e)
    _completeAllForTests: function (callback) {
      ['understand', 'investigate', 'layers', 'incident'].forEach(markDone);
      var cmds = [
        'ss -tan state syn-recv | wc -l', 'dmesg | tail', "tcpdump -nn -c 5 'tcp[tcpflags] == tcp-syn'",
        'sysctl -w net.ipv4.tcp_syncookies=1', 'sysctl -w net.ipv4.tcp_synack_retries=2',
        'iptables -A INPUT -p tcp --syn --dport 443 -m limit --limit 400/s --limit-burst 800 -j ACCEPT',
        'iptables -A INPUT -p tcp --syn --dport 443 -j DROP',
        'echo "net.ipv4.tcp_syncookies = 1" >> /etc/sysctl.d/99-synflood.conf',
        'echo "net.ipv4.tcp_synack_retries = 2" >> /etc/sysctl.d/99-synflood.conf',
        'sysctl --system'
      ];
      cmds.forEach(function (c) { run(host, c); });
      updateTasks();
      if (callback) callback();
    }
  };
})(window.Lab);

/* ===== js/terminal.js ===== */
/* ==========================================================================
   terminal.js — OWNER: Manvith Karkera
   Purpose: the pop-up Linux terminal (Lab.Terminal). A drawer docked to the bottom
   of the page, opened from the header "Terminal" button. It runs commands through
   the pure simulated shell in js/workshop.js and owns the one shared host
   configuration. Whatever the student configures here (sysctl, iptables, nft) is
   evaluated into the four defences the simulation engine understands, which is how
   the terminal controls the mitigations in step 6.
   Nothing here touches the real machine.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var host = null, listeners = [];
  var drawer, out, input, form, openBtn;
  var history = [], historyPos = 0;
  var tall = false;
  var wired = false;
  var cmds = [], curlOk = false;         // everything typed so far (the guide checks against it)
  var guideDone = {}, guideListeners = [];

  function $(id) { return document.getElementById(id); }
  function shell() { return Lab.Workshop.shell; }

  function print(text, cls) {
    var d = document.createElement('div');
    d.className = cls || 'ws-line';
    d.textContent = text;
    out.appendChild(d);
  }

  function motd() {
    var m = (Lab.Content.workshop && Lab.Content.workshop.harden.motd) || [];
    m.forEach(function (l) { print(l, 'ws-line ws-line--dim'); });
    print('Tip: type "help" for commands, or click a suggestion below.', 'ws-line ws-line--dim');
  }

  function notify(line, result) {
    listeners.slice().forEach(function (fn) { fn(host, line, result); });
  }

  function exec(line, silentEcho) {
    if (line.trim()) { history.push(line); historyPos = history.length; }
    if (!silentEcho) print('root@web01:~# ' + line, 'ws-line ws-line--cmd');
    var r = shell().run(host, line);
    cmds.push(line);
    if (/^\s*(sudo\s+)?curl\b/.test(line)) curlOk = r.lines.length > 0 && !/timed out/.test(r.lines.join(' '));
    if (r.clear) out.textContent = '';
    r.lines.forEach(function (l) { print(l); });
    out.scrollTop = out.scrollHeight;
    updateGuide();
    notify(line, r);
    return r;
  }


  // ---- guided runbook ---------------------------------------------------------------------
  function ranMatch(re) { return cmds.some(function (c) { return re.test(c.replace(/^\s*sudo\s+/, '')); }); }

  function stepSatisfied(key) {
    var ev = shell().evaluate(host), st = ev.status;
    var conf = shell().parseConf(host.files['/etc/sysctl.d/99-synflood.conf']);
    switch (key) {
      case 'count': return host.ran.count;
      case 'klog': return host.ran.klog;
      case 'capture': return host.ran.capture;
      case 'readcookies': return ranMatch(/^sysctl\s+(-n\s+)?net\.ipv4\.tcp_syncookies\s*$/);
      case 'cookies': return st.cookies >= 1;
      case 'retries': return st.retries >= 1 && st.retries <= 3;
      case 'rateAccept': return !!st.globalLimit || st.incomplete;
      case 'rateDrop': return !!st.globalLimit && !st.lowLimit;
      case 'listRules': return ranMatch(/^(iptables\s+(-S|-L)|nft\s+list)/);
      case 'persistCookies': return conf['net.ipv4.tcp_syncookies'] >= 1;
      case 'persistRetries': return conf['net.ipv4.tcp_synack_retries'] >= 1 && conf['net.ipv4.tcp_synack_retries'] <= 3;
      case 'load': return host.loadedVersion === host.fileVersion && conf['net.ipv4.tcp_syncookies'] >= 1 && conf['net.ipv4.tcp_synack_retries'] >= 1;
      case 'curl': return curlOk;
      case 'loose': return st.loose === 0;
      case 'notrack': return st.rawNotrack;
      case 'synproxy': return st.synproxyRule;
    }
    return false;
  }

  function guideSteps() { return (Lab.Content.runbook && Lab.Content.runbook.steps) || []; }

  function guideCurrent() {
    var steps = guideSteps();
    for (var i = 0; i < steps.length; i++) if (!guideDone[steps[i].id]) return i;
    return -1;
  }

  function requiredDone() { return guideSteps().every(function (st) { return !st.required || guideDone[st.id]; }); }

  function updateGuide() {
    var steps = guideSteps(), wasRequired = requiredDone(), fresh = [];
    steps.forEach(function (st, i) {
      if (!guideDone[st.id] && stepSatisfied(st.check)) { guideDone[st.id] = true; fresh.push(i); }
    });
    renderGuide(fresh);
    fresh.forEach(function (i) {
      guideListeners.slice().forEach(function (fn) { fn(steps[i], i, !wasRequired && requiredDone()); });
    });
  }

  function renderGuide(fresh) {
    var g = $('term-guide');
    if (!g) return;
    var R = Lab.Content.runbook, steps = guideSteps();
    if (!R) return;
    g.textContent = '';
    var doneCount = steps.filter(function (st) { return guideDone[st.id]; }).length;
    var reqTotal = steps.filter(function (st) { return st.required; }).length;
    var reqDone = steps.filter(function (st) { return st.required && guideDone[st.id]; }).length;

    var head = document.createElement('div'); head.className = 'term-guide__head';
    var h = document.createElement('strong'); h.textContent = R.title; head.appendChild(h);
    var cnt = document.createElement('span'); cnt.id = 'term-guide-count'; cnt.className = 'term-guide__count';
    cnt.textContent = reqDone + ' of ' + reqTotal + ' required steps done'; head.appendChild(cnt);
    g.appendChild(head);
    var track = document.createElement('div'); track.className = 'term-guide__track'; track.setAttribute('aria-hidden', 'true');
    var bar = document.createElement('div'); bar.className = 'term-guide__bar'; bar.style.width = (reqDone / reqTotal * 100) + '%'; track.appendChild(bar);
    g.appendChild(track);

    var live = document.createElement('div'); live.className = 'term-guide__live'; live.setAttribute('role', 'status'); live.id = 'term-guide-live';
    if (fresh && fresh.length) {
      var last = steps[fresh[fresh.length - 1]];
      live.textContent = 'Step complete: ' + last.title + '. ' + last.learned;
    }
    var allReq = requiredDone();
    if (allReq) { var okb = document.createElement('div'); okb.className = 'term-guide__done'; okb.id = 'term-guide-complete'; okb.textContent = R.complete; g.appendChild(okb); }
    if (live.textContent) g.appendChild(live);

    var cur = guideCurrent();
    if (cur >= 0) {
      var st = steps[cur];
      var card = document.createElement('div'); card.className = 'term-guide__card'; card.id = 'term-guide-card';
      var tag = document.createElement('p'); tag.className = 'term-guide__tag';
      tag.textContent = (st.required ? 'Step ' : 'Bonus ') + (cur + 1) + ' of ' + steps.length; card.appendChild(tag);
      var t = document.createElement('h3'); t.className = 'term-guide__title'; t.textContent = st.title; card.appendChild(t);
      var why = document.createElement('p'); why.className = 'term-guide__why'; why.textContent = st.why; card.appendChild(why);
      var lbl = document.createElement('p'); lbl.className = 'term-guide__label'; lbl.textContent = 'Run this command:'; card.appendChild(lbl);
      var pre = document.createElement('pre'); pre.className = 'term-guide__cmd'; pre.id = 'term-guide-command';
      var code = document.createElement('code'); code.textContent = st.command; pre.appendChild(code); card.appendChild(pre);
      var ins = document.createElement('button'); ins.type = 'button'; ins.id = 'btn-guide-insert'; ins.className = 'term-drawer__btn';
      ins.textContent = 'Put it in the prompt';
      ins.addEventListener('click', function () { input.value = st.command; input.focus(); });
      card.appendChild(ins);
      g.appendChild(card);
    }

    var det = document.createElement('details'); det.className = 'term-guide__all';
    var sum = document.createElement('summary'); sum.textContent = 'All steps (' + doneCount + '/' + steps.length + ')'; det.appendChild(sum);
    var ol = document.createElement('ol');
    steps.forEach(function (st, i) {
      var li = document.createElement('li');
      li.className = guideDone[st.id] ? 'is-done' : (i === cur ? 'is-current' : '');
      li.textContent = (guideDone[st.id] ? '✓ ' : '') + st.title + (st.required ? '' : ' (bonus)');
      ol.appendChild(li);
    });
    det.appendChild(ol); g.appendChild(det);
  }

  function setOpen(open, focus) {
    if (!drawer) return;
    drawer.hidden = !open;
    document.body.classList.toggle('has-terminal', open);
    if (openBtn) { openBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); openBtn.classList.toggle('is-open', open); }
    if (open && focus !== false) input.focus({ preventScroll: true });
  }

  function wire() {
    if (wired) return;
    wired = true;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var cmd = input.value;
      input.value = '';
      exec(cmd);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); historyPos = Math.max(0, historyPos - 1); input.value = history[historyPos]; }
      else if (e.key === 'ArrowDown' && history.length) { e.preventDefault(); historyPos = Math.min(history.length, historyPos + 1); input.value = history[historyPos] || ''; }
      else if (e.key === 'Escape') { setOpen(false); if (openBtn) openBtn.focus(); }
    });
    out.addEventListener('click', function () { var sel = window.getSelection && window.getSelection(); if (!sel || sel.isCollapsed) input.focus(); });
    $('btn-term-close').addEventListener('click', function () { setOpen(false); if (openBtn) openBtn.focus(); });
    $('btn-term-clear').addEventListener('click', function () { out.textContent = ''; input.focus(); });
    $('btn-term-size').addEventListener('click', function () {
      tall = !tall;
      drawer.classList.toggle('is-tall', tall);
      $('btn-term-size').setAttribute('aria-label', tall ? 'Make the terminal shorter' : 'Make the terminal taller');
    });
    if (openBtn) openBtn.addEventListener('click', function () { setOpen(drawer.hidden, true); });
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote') && openBtn && !openBtn.hidden) { e.preventDefault(); setOpen(drawer.hidden, true); }
    });
    var chips = $('term-chips');
    if (chips) {
      var lab = document.createElement('span'); lab.className = 'ws-chips__label'; lab.textContent = 'Try:'; chips.appendChild(lab);
      ['help', 'ss -tan state syn-recv | wc -l', 'dmesg | tail', 'sysctl -a | grep syn', 'sysctl -w net.ipv4.tcp_syncookies=1', 'iptables -S'].forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = c;
        b.addEventListener('click', function () { input.value = c; input.focus(); });
        chips.appendChild(b);
      });
    }
  }

  Lab.Terminal = {
    init: function () {
      drawer = $('terminal-drawer'); out = $('ws-term-output'); input = $('ws-term-input'); form = $('ws-term-form'); openBtn = $('btn-terminal');
      host = shell().createHost();
      if (!drawer || !out || !input || !form) return;
      wire();
      out.textContent = '';
      motd();
      cmds = []; curlOk = false; guideDone = {};
      renderGuide();
    },
    reset: function () {
      host = shell().createHost();
      history = []; historyPos = 0; cmds = []; curlOk = false; guideDone = {};
      if (out) { out.textContent = ''; motd(); }
      renderGuide();
      setOpen(false, false);
    },
    getHost: function () { return host; },
    getDefences: function () { return shell().evaluate(host); },
    setLevel: function (level) { if (host) host.level = level; },
    onGuide: function (fn) { guideListeners.push(fn); },
    guideProgress: function () { var st = guideSteps(); return { done: st.filter(function (x) { return guideDone[x.id]; }).length, total: st.length, requiredDone: requiredDone() }; },
    on: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; },
    open: function (focus) { setOpen(true, focus); },
    close: function () { setOpen(false, false); },
    isOpen: function () { return !!drawer && !drawer.hidden; },
    exec: function (line) { return exec(line, false); }       // runs a command as if typed (used by tests)
  };
})(window.Lab);

/* ===== js/workflow.js ===== */
/* ==========================================================================
   workflow.js — OWNER: Manvith Karkera
   Purpose: boots the app, renders Lab.Content into the page, runs the 8-step
   state machine, wires every button, handles Stop / Reset / Restart and the
   completion popup. This is the ONLY file that runs code on DOMContentLoaded
   and the only one that wires buttons; the other modules just render.

   The journey (CONTRACT/brief):
     Before You Begin -> Theory -> 1 Review -> 2 Baseline -> 3 Flood -> 4 Observe
     -> 5 Stop -> 6 Mitigation -> 7 Comparison -> 8 Quiz -> Completion popup

   How gating works: every step has a status (locked | ready | in-progress |
   completed) kept in `status[]`. updateControls() derives which buttons are
   enabled from the current step and from engine.isRunning(), so a control that
   makes no sense in the current state is always disabled.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var STEP_COUNT = 9;
  var NO_DEFENCES = { synCookies: false, rateLimit: false, shortTimeout: false, firewall: false };
  var MIT_INPUTS = {                     // checkbox id -> key in engine.setMitigation / Lab.Content.mitigations
    'mit-syn-cookies': 'synCookies',
    'mit-rate-limit': 'rateLimit',
    'mit-short-timeout': 'shortTimeout',
    'mit-firewall': 'firewall'
  };
  var LAB_SECTIONS = ['stepper-section', 'topology', 'controls', 'dashboard', 'log'];   // visible once the lab starts
  var PASS_PERCENT = 67;

  var C;                                 // Lab.Content
  var engine;
  var started = false;
  var status = [];                       // status[0] is step 1
  var runs = { baseline: null, attack: null, mitigated: null };
  var currentRunKind = null;             // 'baseline' | 'attack' | 'mitigated' while a run is active
  var quiz = { initialised: false, done: false, score: 0, total: 0 };
  var workshop = { initialised: false, done: false, summary: null };
  var shownStep = 0;                     // the step the panel currently shows
  var pendingConfirm = null;
  var terminalPopped = false;            // the terminal opens by itself once, when step 6 starts
  var lastDefences = '';

  // ---- small helpers -------------------------------------------------------
  function $(id) { return document.getElementById(id); }
  function show(el, visible) { if (el) el.hidden = !visible; }
  function setDisabled(id, disabled) { var e = $(id); if (e) e.disabled = !!disabled; }
  function reducedMotion() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }

  function focusEl(el) { if (el) el.focus({ preventScroll: true }); }
  function scrollToEl(el) {
    if (el) el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  function log(message, level) { Lab.Log.add(message, level || 'info'); }
  function notify(message, level) { Lab.Dashboard.notify(message, level || 'info'); }

  function mitigationNames(summaryOrMap) {
    var map = summaryOrMap || {};
    return Object.keys(MIT_INPUTS).map(function (id) { return MIT_INPUTS[id]; })
      .filter(function (k) { return map[k]; })
      .map(function (k) { return C.mitigations[k].title; });
  }

  function selectedMitigation() {
    var m = {};
    Object.keys(MIT_INPUTS).forEach(function (id) { var el = $(id); m[MIT_INPUTS[id]] = !!(el && el.checked); });
    return m;
  }

  function anyMitigationSelected() {
    var m = selectedMitigation();
    return Object.keys(m).some(function (k) { return m[k]; });
  }

  function resultsExist() {
    if (!started) return false;
    return !!(runs.baseline || runs.attack || runs.mitigated || engine.isRunning() ||
      engine.getState().history.length || quiz.initialised || workshop.initialised);
  }

  // ---- rendering Lab.Content -----------------------------------------------
  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function renderContent() {
    var h1 = document.querySelector('#lab-header h1');
    if (h1) h1.textContent = C.title;

    var obj = $('lab-objective');
    if (obj) { obj.textContent = ''; obj.appendChild(el('strong', null, 'Objective: ')); obj.appendChild(document.createTextNode(C.objective)); }
    if ($('lab-disclaimer')) $('lab-disclaimer').textContent = C.disclaimer;
    if ($('lab-footer-note')) $('lab-footer-note').textContent = C.disclaimer;

    var list = $('guidelines-list');
    if (list) { list.textContent = ''; C.guidelines.forEach(function (g) { list.appendChild(el('li', null, g)); }); }

    // Theory: TCP, the handshake, SYN flood, availability, analogy.
    var t = $('theory-content');
    if (t) {
      t.textContent = '';
      t.appendChild(el('h3', null, 'What is TCP?'));
      t.appendChild(el('p', null, C.theory.tcp));
      t.appendChild(el('h3', null, 'The three-way handshake'));
      var steps = el('ol', 'handshake-list');
      C.theory.handshake.forEach(function (h) {
        var li = el('li');
        li.appendChild(el('strong', 'handshake-list__name', h.name));
        li.appendChild(document.createTextNode(' ' + h.text));
        steps.appendChild(li);
      });
      t.appendChild(steps);
      t.appendChild(el('h3', null, 'What is a SYN flood?'));
      t.appendChild(el('p', null, C.theory.synFlood));
      t.appendChild(el('h3', null, 'Why availability matters'));
      t.appendChild(el('p', null, C.theory.availability));
      var analogy = el('aside', 'analogy');
      analogy.appendChild(el('strong', 'analogy__title', 'An analogy'));
      analogy.appendChild(el('p', null, C.theory.analogy));
      t.appendChild(analogy);
    }

    // Mitigations: title, explanation and limitation next to each switch.
    Object.keys(MIT_INPUTS).forEach(function (id) {
      var input = $(id);
      if (!input) return;
      var m = C.mitigations[MIT_INPUTS[id]];
      var item = input.closest('.mitigation-item');
      var label = item.querySelector('label');
      if (label) label.textContent = m.title;
      item.appendChild(el('p', 'mitigation-text', m.text));
      var lim = el('p', 'limitation');
      lim.appendChild(el('strong', null, 'Limitation: '));
      lim.appendChild(document.createTextNode(m.limitation));
      item.appendChild(lim);
      if (m.command) { var cmd = el('pre', 'mitigation-command'); cmd.appendChild(el('code', null, m.command)); item.appendChild(cmd); }
    });

    // Step list titles.
    document.querySelectorAll('#step-list li').forEach(function (li, i) { li.textContent = C.steps[i].title; });

    // Extra control on the theory section: back to the lab / guidelines.
    var theory = $('section-theory');
    if (theory && !$('btn-close-theory')) {
      var close = el('button', 'btn btn--primary', 'Close theory');
      close.type = 'button';
      close.id = 'btn-close-theory';
      theory.appendChild(close);
    }
  }

  // ---- stepper -------------------------------------------------------------
  function setStatus(n, s) {
    status[n - 1] = s;
    var li = document.querySelector('#step-list li[data-step="' + n + '"]');
    if (!li) return;
    li.setAttribute('data-status', s);
    li.className = 'step step--' + s;
    if (s === 'in-progress') li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    var label = { locked: 'locked', ready: 'ready', 'in-progress': 'in progress', completed: 'completed' }[s];
    li.setAttribute('aria-label', 'Step ' + n + ': ' + C.steps[n - 1].title + ', ' + label);
  }

  function currentStep() {
    for (var i = 0; i < STEP_COUNT; i++) if (status[i] !== 'completed') return i + 1;
    return STEP_COUNT + 1;                                    // everything done
  }

  function completeStep(n) {
    if (status[n - 1] === 'completed') return;
    setStatus(n, 'completed');
    // unlock the following step: steps that need a button press are "ready", reading steps are "in progress"
    var next = n + 1;
    if (next <= STEP_COUNT && status[next - 1] === 'locked') setStatus(next, next >= 7 ? 'in-progress' : 'ready');
  }

  function renderStepPanel() {
    var cur = currentStep();
    var title = $('step-title'), instr = $('step-instructions'), actions = $('step-actions');
    if (!title) return;
    actions.textContent = '';
    if (cur > STEP_COUNT) {
      title.textContent = C.completion.title;
      instr.textContent = C.completion.message;
      var again = el('button', 'btn btn--ghost', 'Restart the lab');
      again.type = 'button';
      again.addEventListener('click', function () { requestReset(true); });
      actions.appendChild(again);
      return;
    }
    title.textContent = 'Step ' + cur + ' of ' + STEP_COUNT + ': ' + C.steps[cur - 1].title;
    instr.textContent = C.steps[cur - 1].instructions;
    if (cur === 1 || cur === 7) {
      var go = el('button', 'btn btn--primary', 'Continue');
      go.type = 'button';
      go.addEventListener('click', cur === 1 ? finishStep1 : finishStep7);
      actions.appendChild(go);
    }
  }

  // Sections unlock as the journey advances; the panel text and focus follow the current step.
  function refresh(moveFocus) {
    var cur = currentStep();
    show($('mitigation'), started && cur >= 6);
    show($('comparison'), started && cur >= 7 && !!runs.mitigated);
    show($('workshop'), started && cur >= 8);
    if (started && cur >= 8 && !workshop.initialised) initWorkshop();
    show($('quiz'), started && cur >= 9);
    if (started && cur === 9 && !quiz.initialised) initQuiz();
    if (started && cur >= 6 && !terminalPopped) { terminalPopped = true; Lab.Terminal.open(true); log('Terminal opened: configure the server\'s defences with Linux commands.', 'info'); }
    renderStepPanel();
    updateControls();
    if (moveFocus && cur !== shownStep) focusEl($('step-title'));
    shownStep = cur;
    if (started && cur > STEP_COUNT) maybeComplete();
  }

  // ---- controls ------------------------------------------------------------
  function updateControls() {
    var running = engine.isRunning();
    var cur = currentStep();
    var baselineDone = !!runs.baseline;
    var attackAllowed = started && baselineDone && !running && !runs.mitigated && cur >= 3 && cur <= 6;
    var mitigationAllowed = started && !running && !!runs.attack && (cur === 6 || cur === 7);

    setDisabled('btn-start', !($('ack-checkbox') && $('ack-checkbox').checked));
    setDisabled('btn-baseline', !(started && !running && cur === 2));
    setDisabled('btn-start-flood', !attackAllowed);
    setDisabled('attack-level', !attackAllowed);
    setDisabled('btn-stop-sim', !running);
    setDisabled('btn-stop', !running);
    Object.keys(MIT_INPUTS).forEach(function (id) { setDisabled(id, true); });   // read-only: the terminal controls them
    setDisabled('btn-run-mitigated', !(mitigationAllowed && anyMitigationSelected()));

    var runBtn = $('btn-run-mitigated');
    if (runBtn) runBtn.title = (mitigationAllowed && !anyMitigationSelected()) ? 'Switch on at least one defence first' : '';

    // Guide the student: softly highlight the one control that is the natural next action.
    var next = null;
    if (started && running) next = (cur === 4 || cur === 5) ? 'btn-stop-sim' : null;
    else if (cur === 2) next = 'btn-baseline';
    else if (cur === 3) next = 'btn-start-flood';
    else if (mitigationAllowed && cur === 6 && anyMitigationSelected()) next = 'btn-run-mitigated';
    ['btn-baseline', 'btn-start-flood', 'btn-stop-sim', 'btn-run-mitigated', 'btn-start'].forEach(function (id) {
      var b = $(id);
      if (b) b.classList.toggle('is-next', id === next || (id === 'btn-start' && !b.disabled && !started));
    });
    var rs = $('run-status');
    if (rs) rs.classList.toggle('is-running', running);
  }

  function updateRunStatus(state) {
    var label = $('run-status-label');
    var bar = document.querySelector('#run-status .progress__bar');
    var track = document.querySelector('#run-status .progress');
    if (!label) return;
    if (state && state.running) {
      var total = state.mode === 'baseline' ? (state.params.baselineSeconds || 20) : (state.params.attackSeconds || 40);
      var what = currentRunKind === 'baseline' ? 'Baseline traffic'
        : (currentRunKind === 'mitigated' ? 'SYN flood with defences (' + state.level + ')' : 'SYN flood (' + state.level + ')');
      label.textContent = what + ' — ' + state.t + ' / ' + total + ' simulated seconds';
      var pct = Math.min(100, state.t / total * 100);
      if (bar) bar.style.width = pct + '%';
      if (track) track.setAttribute('aria-valuenow', Math.round(pct));
    }
  }

  function resetRunStatus(text) {
    var label = $('run-status-label');
    var bar = document.querySelector('#run-status .progress__bar');
    if (label) label.textContent = text || 'No simulation running';
    if (bar) bar.style.width = '0%';
  }

  // The terminal is the control panel: whatever the Linux configuration enables is shown on the four switches.
  function onTerminalCommand() {
    var ev = Lab.Terminal.getDefences();
    Object.keys(MIT_INPUTS).forEach(function (id) { var c = $(id); if (c) c.checked = !!ev.defences[MIT_INPUTS[id]]; });
    var now = mitigationNames(ev.defences).join(', ');
    if (now !== lastDefences) {
      lastDefences = now;
      log('Terminal: defences now active: ' + (now || 'none') + '.', 'info');
      if (engine.isRunning()) notify('Defence changes apply to the next run.', 'info');
    }
    updateControls();
  }

  // ---- journey actions -------------------------------------------------------
  function startLab() {
    started = true;
    show($('screen-guidelines'), false);
    LAB_SECTIONS.forEach(function (id) { show($(id), true); });
    show($('section-theory'), true);
    show($('btn-terminal'), true);
    for (var n = 1; n <= STEP_COUNT; n++) setStatus(n, 'locked');
    setStatus(1, 'in-progress');
    shownStep = 0;
    log('Lab initialised. Step 1: review the theory.', 'info');
    refresh(false);
    window.scrollTo(0, 0);
    focusEl($('step-title'));
    Lab.Visuals.playHandshakeDemo();
  }

  function finishStep1() {
    completeStep(1);
    show($('section-theory'), false);
    refresh(true);
    scrollToEl($('stepper-section'));
  }

  function finishStep7() {
    completeStep(7);
    refresh(true);
    scrollToEl($('workshop'));
  }

  function clearVisuals() { Lab.Visuals.reset(); Lab.Dashboard.reset(); }

  function startBaseline() {
    if (engine.isRunning()) return;
    engine.setMitigation(NO_DEFENCES);
    currentRunKind = 'baseline';
    clearVisuals();
    setStatus(2, 'in-progress');
    engine.runBaseline();
    refresh(false);
  }

  function startFlood() {
    if (engine.isRunning() || !runs.baseline) return;
    var level = $('attack-level').value;
    engine.setMitigation(NO_DEFENCES);
    currentRunKind = 'attack';
    clearVisuals();
    Lab.Terminal.setLevel(level);
    engine.runAttack(level);
    // Step 3 (launch) is done the moment the flood starts; steps 4 and 5 follow its progress.
    completeStep(3);
    if (status[3] !== 'completed') setStatus(4, 'in-progress');
    if (status[4] === 'locked') setStatus(5, 'ready');
    refresh(true);
  }

  function startMitigated() {
    if (engine.isRunning() || !runs.attack || !anyMitigationSelected()) return;
    var chosen = selectedMitigation();
    var level = runs.attack.level;
    $('attack-level').value = level;                     // the same attack as before, so the comparison is fair
    engine.setMitigation(chosen);
    currentRunKind = 'mitigated';
    clearVisuals();
    setStatus(6, 'in-progress');
    Lab.Terminal.setLevel(level);
    engine.runAttack(level);
    refresh(false);
  }

  function stopRun() {
    if (engine.isRunning()) engine.stop();               // engine emits runEnded, which does the bookkeeping
  }

  function onRunEnded(summary) {
    var kind = currentRunKind;
    currentRunKind = null;
    resetRunStatus(summary.stoppedEarly ? 'Simulation stopped' : 'Simulation finished');
    if (!summary.stoppedEarly) { var fullBar = document.querySelector('#run-status .progress__bar'); if (fullBar) fullBar.style.width = '100%'; }
    var pct = Math.round(summary.avgAvailability);

    if (kind === 'baseline') {
      if (summary.stoppedEarly) {
        setStatus(2, 'ready');
        log('Baseline stopped early and discarded. Run it again to finish step 2.', 'warn');
        notify('Baseline stopped early. Run it again to record a full baseline.', 'warn');
      } else {
        runs.baseline = summary;
        completeStep(2);
        log('Baseline generated: average availability ' + pct + '%, server ' + summary.finalServerState + '.', 'success');
        notify('Baseline recorded. You can now launch the SYN flood.', 'success');
      }
    } else if (kind === 'attack') {
      runs.attack = summary;
      [3, 4, 5].forEach(completeStep);
      log('Attack run recorded (' + summary.level + '): average availability ' + pct + '%, server ' + summary.finalServerState + '.', 'warn');
      notify('Attack run recorded. Next: enable some defences.', 'info');
    } else if (kind === 'mitigated') {
      if (summary.stoppedEarly) {
        setStatus(6, 'ready');
        log('Mitigated run stopped early and discarded. Run it again to finish step 6.', 'warn');
        notify('Mitigated run stopped early. Run it again to compare fairly.', 'warn');
      } else {
        runs.mitigated = summary;
        completeStep(6);
        var names = mitigationNames(summary.mitigation).join(', ');
        log('Mitigated run recorded (' + names + '): average availability ' + pct + '%, server ' + summary.finalServerState + '.', 'success');
        Lab.Dashboard.renderComparison(runs);
        log('Comparison ready.', 'info');
        notify('Comparison ready. Review the table below.', 'success');
      }
    }
    refresh(true);
    if (kind === 'mitigated' && runs.mitigated && !summary.stoppedEarly) scrollToEl($('comparison'));
  }

  function onServerStateChange(e) {
    if (currentRunKind === 'attack' && (e.to === 'Degraded' || e.to === 'Unavailable') && status[3] !== 'completed') {
      completeStep(4);
      if (status[4] === 'locked') setStatus(5, 'ready');
      refresh(true);
    }
  }

  // ---- quiz and completion -----------------------------------------------------
  function initWorkshop() {
    workshop.initialised = true;
    Lab.Workshop.init($('workshop-content'), {
      getLevel: function () { return runs.attack ? runs.attack.level : 'medium'; },
      onFinished: onWorkshopFinished
    });
  }

  function onWorkshopFinished(summary) {
    workshop.done = true;
    workshop.summary = summary;
    var h = summary.hardening;
    log('Workshop completed' + (h ? ': hardened server ' + Math.round(h.after) + '% available (' + h.state + ') against ' + h.level + ' attack' : '') + '.', 'success');
    completeStep(8);
    refresh(true);
    scrollToEl($('quiz'));
  }

  function initQuiz() {
    quiz.initialised = true;
    setStatus(9, 'in-progress');
    Lab.Quiz.init($('quiz-container'), C.quiz, onQuizFinished);
  }

  function onQuizFinished(result) {
    quiz.done = true;
    quiz.score = result.score;
    quiz.total = result.total;
    log('Quiz finished: ' + result.score + ' / ' + result.total + '.', 'success');
    completeStep(9);
    refresh(false);
  }

  function maybeComplete() {
    if (!(runs.baseline && runs.attack && runs.mitigated && status[6] === 'completed' && workshop.done && quiz.done)) return;
    var dlg = $('modal-complete');
    if (!dlg || dlg.open) return;
    var pct = (n) => (n === null || n === undefined ? '—' : Math.round(n) + '%');
    $('complete-message').textContent = C.completion.message;
    $('complete-baseline').textContent = pct(runs.baseline.avgAvailability);
    $('complete-attack').textContent = pct(runs.attack.avgAvailability);
    $('complete-mitigated').textContent = pct(runs.mitigated.avgAvailability);
    var hs = workshop.summary && workshop.summary.hardening;
    $('complete-hardened').textContent = hs ? Math.round(hs.after) + '% available, ' + hs.state + ' (was ' + Math.round(hs.before) + '%)' : '—';
    $('complete-score').textContent = quiz.score + ' / ' + quiz.total;
    var passed = quiz.total && quiz.score / quiz.total * 100 >= PASS_PERCENT;
    $('complete-status').textContent = passed ? 'Passed' : 'Completed — review recommended';
    $('modal-complete').querySelector('h2').textContent = C.completion.title;
    log('Experiment completed.', 'success');
    dlg.showModal();
    focusEl($('btn-review'));
  }

  // ---- theory -------------------------------------------------------------------
  function openTheory() {
    show($('section-theory'), true);
    var close = $('btn-close-theory');
    if (close) close.textContent = started ? 'Close theory' : 'Back to the guidelines';
    scrollToEl($('section-theory'));
    focusEl($('theory-heading'));
    Lab.Visuals.playHandshakeDemo();
  }

  function closeTheory() {
    show($('section-theory'), false);
    if (!started) { scrollToEl($('screen-guidelines')); focusEl($('guidelines-heading')); }
    else { scrollToEl($('stepper-section')); focusEl($('step-title')); }
  }

  // ---- reset / restart ------------------------------------------------------------
  function openConfirm(message, onYes) {
    var dlg = $('modal-confirm');
    if (!dlg || !dlg.showModal) { onYes(); return; }
    $('confirm-message').textContent = message;
    pendingConfirm = onYes;
    dlg.showModal();
    focusEl($('btn-confirm-no'));
  }

  function closeConfirm(accepted) {
    var dlg = $('modal-confirm');
    var action = pendingConfirm;
    pendingConfirm = null;
    if (dlg && dlg.open) dlg.close();
    if (accepted && action) action();
  }

  function requestReset(toStart) {
    if (resultsExist()) {
      openConfirm(toStart
        ? 'Restart the lab from the beginning? Your results, log and quiz progress will be cleared.'
        : 'Reset the experiment? Your results, log and quiz progress will be cleared and you will return to Step 1.',
      function () { doReset(toStart); });
    } else {
      doReset(toStart);
    }
  }

  function doReset(toStart) {
    var done = $('modal-complete');
    if (done && done.open) done.close();
    engine.reset();                                      // stops any timer and clears queue, metrics, history, mitigation
    Lab.Visuals.reset();
    Lab.Dashboard.reset();
    Lab.Log.clear();
    Lab.Quiz.reset();
    Lab.Terminal.reset();
    terminalPopped = false;
    lastDefences = '';
    if (workshop.initialised) Lab.Workshop.reset();
    Object.keys(MIT_INPUTS).forEach(function (id) { var c = $(id); if (c) c.checked = false; });
    runs = { baseline: null, attack: null, mitigated: null };
    quiz = { initialised: false, done: false, score: 0, total: 0 };
    workshop = { initialised: false, done: false, summary: null };
    currentRunKind = null;
    pendingConfirm = null;
    if ($('attack-level')) $('attack-level').value = 'medium';
    resetRunStatus();
    for (var n = 1; n <= STEP_COUNT; n++) setStatus(n, 'locked');
    shownStep = 0;

    if (toStart) {
      started = false;
      show($('btn-terminal'), false);
      if ($('ack-checkbox')) $('ack-checkbox').checked = false;
      LAB_SECTIONS.concat(['section-theory', 'mitigation', 'comparison', 'workshop', 'quiz']).forEach(function (id) { show($(id), false); });
      show($('screen-guidelines'), true);
      refresh(false);
      window.scrollTo(0, 0);
      focusEl($('guidelines-heading'));
    } else {
      setStatus(1, 'in-progress');
      show($('section-theory'), true);
      log('Experiment reset. Back at Step 1.', 'info');
      refresh(true);
      window.scrollTo(0, 0);
    }
  }

  // ---- boot -----------------------------------------------------------------------
  function wire() {
    var ack = $('ack-checkbox');
    ack.addEventListener('change', updateControls);
    $('btn-start').addEventListener('click', startLab);
    $('btn-view-theory').addEventListener('click', openTheory);
    $('btn-theory').addEventListener('click', openTheory);
    $('btn-close-theory').addEventListener('click', closeTheory);
    $('btn-play-handshake').addEventListener('click', function () { Lab.Visuals.playHandshakeDemo(); });

    $('btn-baseline').addEventListener('click', startBaseline);
    $('btn-start-flood').addEventListener('click', startFlood);
    $('btn-stop-sim').addEventListener('click', stopRun);
    $('btn-stop').addEventListener('click', stopRun);
    $('btn-run-mitigated').addEventListener('click', startMitigated);

    $('btn-open-terminal-mit').addEventListener('click', function () { Lab.Terminal.open(true); });

    $('btn-reset').addEventListener('click', function () { requestReset(false); });
    $('btn-restart').addEventListener('click', function () { requestReset(true); });
    $('btn-restart-lab').addEventListener('click', function () { doReset(true); });
    $('btn-confirm-yes').addEventListener('click', function () { closeConfirm(true); });
    $('btn-confirm-no').addEventListener('click', function () { closeConfirm(false); });
    $('modal-confirm').addEventListener('cancel', function () { pendingConfirm = null; });
    $('btn-review').addEventListener('click', function () {
      $('modal-complete').close();
      show($('comparison'), true);
      scrollToEl($('comparison'));
      focusEl($('comparison-heading'));
    });

    engine.on('runEnded', onRunEnded);
    engine.on('serverStateChange', onServerStateChange);
    engine.on('tick', updateRunStatus);
  }

  function boot() {
    C = Lab.Content;
    engine = Lab.Engine.create();
    Lab.Visuals.init(engine);
    Lab.Dashboard.init(engine);
    Lab.Terminal.init();
    Lab.Terminal.on(onTerminalCommand);
    Lab.Terminal.onGuide(function (step, i, allRequired) {
      log('Runbook step done: ' + step.title + '.', 'success');
      if (allRequired) { log('Runbook complete. Run the mitigated simulation to measure it.', 'success'); notify('Runbook complete. Press Run With Mitigation.', 'success'); }
    });
    renderContent();
    for (var n = 1; n <= STEP_COUNT; n++) setStatus(n, 'locked');
    wire();
    updateControls();
    Lab.app = { engine: engine };                        // handy in the console while developing
  }

  document.addEventListener('DOMContentLoaded', boot);
})(window.Lab);
