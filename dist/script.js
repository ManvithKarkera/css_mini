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
    ),

    check: icon('<path d="m5 12 4 4L19 6"/>'),
    cross: icon('<path d="m6 6 12 12M18 6 6 18"/>'),
    lock: icon('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/>'),
    warning: icon('<path d="m12 3 10 18H2L12 3z"/><path d="M12 9v5M12 18h.01"/>'),
    info: icon('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    arrowUp: icon('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    arrowDown: icon('<path d="M12 5v14m6-6-6 6-6-6"/>'),

    element: function (name, className) {
      var wrapper = document.createElement('span');
      wrapper.innerHTML = Lab.Icons[name] || '';
      var svg = wrapper.firstElementChild;
      if (svg && className) svg.setAttribute('class', className);
      return svg;
    }
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
          'Server state changed: ' + from + ' to ' + state.serverState);
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

/* ===== js/backlog-art.js ===== */
/* ==========================================================================
   backlog-art.js — GENERATED by tools/backlog/build.mjs, do not edit by hand.
   Lab.BacklogArt: the static SVG of the backlog machine and its geometry.
   Lab.Iso: the Anatomy iso kit (MIT, tools/backlog/ANATOMY-LICENSE), used by
   backlog.js to move parts and rebuild the needle and turnstile paddles.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';
const AZIMUTH = 45;
const ELEVATION = 30;
const SHADES = 4;
const RADIANS = Math.PI / 180;
const UNIT = Math.sqrt(1.6);
function cameraOf({ scale, azimuth = AZIMUTH, elevation = ELEVATION }) {
    const a = azimuth * RADIANS;
    const e = elevation * RADIANS;
    return { sinA: Math.sin(a), cosA: Math.cos(a), sinE: Math.sin(e), cosE: Math.cos(e), k: scale * UNIT };
}
function iso([x, y, z], projection) {
    const { origin } = projection;
    const { sinA, cosA, sinE, cosE, k } = cameraOf(projection);
    return [origin[0] + (x * sinA - y * cosA) * k, origin[1] + ((x * cosA + y * sinA) * sinE - z * cosE) * k];
}
function towardViewer(projection) {
    const { sinA, cosA } = cameraOf(projection);
    return [cosA, sinA];
}
function depthOf([x, y, z], projection) {
    const { sinA, cosA, sinE, cosE } = cameraOf(projection);
    return (x * cosA + y * sinA) * cosE + z * sinE;
}
const tenth = (value) => {
    const text = (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, "");
    return text === "-0" ? "0" : text;
};
function pathOf(points, closed = false) {
    if (!points.length)
        return "";
    return points.map(([x, y], at) => `${at ? "L" : "M"}${tenth(x)} ${tenth(y)}`).join("") + (closed ? "Z" : "");
}
const joinPaths = (paths) => paths.filter(Boolean).join("");
function roundedPlan({ x, y, w, d, r }, steps = 8) {
    const radius = Math.max(0, Math.min(r, w / 2, d / 2));
    const corners = [
        [x + w - radius, y + radius, -90],
        [x + w - radius, y + d - radius, 0],
        [x + radius, y + d - radius, 90],
        [x + radius, y + radius, 180],
    ];
    const out = [];
    for (const [cx, cy, start] of corners) {
        const count = radius > 0 ? steps : 0;
        for (let step = 0; step <= count; step++) {
            const angle = (start + (count ? (90 * step) / count : 45)) * RADIANS;
            out.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
        }
    }
    return out;
}
function signedArea(points) {
    let area = 0;
    for (let index = 0; index < points.length; index++) {
        const [ax, ay] = points[index];
        const [bx, by] = points[(index + 1) % points.length];
        area += ax * by - bx * ay;
    }
    return area / 2;
}
const oriented = (points) => (signedArea(points) < 0 ? [...points].reverse() : points);
function convexHull(points) {
    const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (sorted.length < 3)
        return sorted;
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [];
    for (const point of sorted) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0)
            lower.pop();
        lower.push(point);
    }
    const upper = [];
    for (let index = sorted.length - 1; index >= 0; index--) {
        const point = sorted[index];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0)
            upper.pop();
        upper.push(point);
    }
    return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
function runsOf(flags, want) {
    const count = flags.length;
    const runs = [];
    const start = flags.findIndex((flag, index) => flag !== flags[(index + count - 1) % count]);
    if (start < 0)
        return flags[0] === want ? [Array.from({ length: count + 1 }, (_, index) => index % count)] : [];
    let run = null;
    for (let step = 0; step < count; step++) {
        const index = (start + step) % count;
        if (flags[index] === want) {
            if (!run)
                run = [index];
            run.push((index + 1) % count);
        }
        else if (run) {
            runs.push(run);
            run = null;
        }
    }
    if (run)
        runs.push(run);
    return runs;
}
function extrude(ring, z, height, projection, options = {}) {
    const convex = options.convex ?? true;
    const count = ring.length;
    const counter = signedArea(ring) > 0;
    const [vx, vy] = towardViewer(projection);
    const { sinA, cosA } = cameraOf(projection);
    const normals = ring.map(([ax, ay], index) => {
        const [bx, by] = ring[(index + 1) % count];
        const dx = bx - ax;
        const dy = by - ay;
        const length = Math.hypot(dx, dy) || 1;
        return (counter ? [dy / length, -dx / length] : [-dy / length, dx / length]);
    });
    const facing = normals.map(([nx, ny]) => nx * vx + ny * vy > 1e-9);
    const top = ring.map(([x, y]) => iso([x, y, z + height], projection));
    const bottom = ring.map(([x, y]) => iso([x, y, z], projection));
    const outline = [];
    const crease = [];
    for (const run of runsOf(facing, false))
        outline.push(pathOf(run.map((index) => top[index])));
    for (const run of runsOf(facing, true)) {
        crease.push(pathOf(run.map((index) => top[index])));
        if (height > 0)
            outline.push(pathOf(run.map((index) => bottom[index])));
    }
    if (height > 0) {
        for (let index = 0; index < count; index++) {
            if (facing[(index + count - 1) % count] !== facing[index])
                outline.push(pathOf([top[index], bottom[index]]));
        }
    }
    let fill;
    if (convex) {
        fill = pathOf(convexHull([...top, ...bottom]), true);
    }
    else {
        const parts = [pathOf(oriented(top), true), pathOf(oriented(bottom), true)];
        for (let index = 0; index < count; index++) {
            if (!facing[index])
                continue;
            const next = (index + 1) % count;
            parts.push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
        }
        fill = parts.join("");
    }
    const buckets = Array.from({ length: SHADES }, () => []);
    if (height > 0) {
        const [lx, ly] = [-sinA, cosA];
        for (let index = 0; index < count; index++) {
            if (!facing[index])
                continue;
            const [nx, ny] = normals[index];
            const lit = (nx * lx + ny * ly + 1) / 2;
            const shade = Math.min(SHADES - 1, Math.max(0, Math.floor(lit * SHADES)));
            const next = (index + 1) % count;
            buckets[shade].push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
        }
    }
    let bevel;
    if (options.bevel && options.bevel > 0) {
        const by = options.bevel;
        const inset = ring.map(([x, y], index) => {
            const [ax, ay] = normals[(index + count - 1) % count];
            const [bx, by2] = normals[index];
            const mx = ax + bx;
            const my = ay + by2;
            const length = Math.hypot(mx, my) || 1;
            return [x - (mx / length) * by, y - (my / length) * by];
        });
        const insetTop = inset.map(([x, y]) => iso([x, y, z + height], projection));
        bevel = runsOf(facing, true)
            .map((run) => pathOf([top[run[0]], ...run.slice(1, -1).map((index) => insetTop[index]), top[run[run.length - 1]]]))
            .join("");
    }
    return {
        fill,
        outline: outline.join(""),
        crease: crease.join(""),
        top: pathOf(oriented(top), true),
        shades: buckets.map((paths) => paths.join("")),
        bevel,
    };
}
const ringOf = (plan, steps = 8) => roundedPlan(plan, steps);
function slabOf(plan, z, height, projection, steps = 8, bevel = 0) {
    return extrude(ringOf(plan, steps), z, height, projection, { convex: true, bevel });
}
function circleRing(cx, cy, radius, steps = 40) {
    return Array.from({ length: steps }, (_, step) => {
        const angle = (step / steps) * Math.PI * 2;
        return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    });
}
function cylinder(cx, cy, radius, z, height, projection, steps = 32, bevel = 0) {
    return extrude(circleRing(cx, cy, radius, steps), z, height, projection, { convex: true, bevel });
}
const insetPlan = ({ x, y, w, d, r }, by) => ({ x: x + by, y: y + by, w: w - by * 2, d: d - by * 2, r: Math.max(0, r - by) });
function onTop(points, z, projection, closed = false) {
    return pathOf(points.map(([x, y]) => iso([x, y, z], projection)), closed);
}
const planOutline = (plan, z, projection, steps = 8) => onTop(ringOf(plan, steps), z, projection, true);
const lineOnTop = (from, to, z, projection) => onTop([from, to], z, projection);
const segment = (from, to, projection) => pathOf([iso(from, projection), iso(to, projection)]);
const rise = (at, from, to, projection) => segment([at[0], at[1], from], [at[0], at[1], to], projection);
const ring = (cx, cy, radius, z, projection, steps = 40) => onTop(circleRing(cx, cy, radius, steps), z, projection, true);
const pointsAt = (points, projection) => points.map((point) => iso(point, projection));
function dotGrid(x, y, columns, rows, gap, z, projection) {
    const dots = [];
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++)
            dots.push(iso([x + column * gap, y + row * gap, z], projection));
    }
    return dots;
}
function corners({ x, y, w, d }, inset = 0) {
    return [
        [x + inset, y + inset],
        [x + w - inset, y + inset],
        [x + inset, y + d - inset],
        [x + w - inset, y + d - inset],
    ];
}
function boxCorners({ x, y, w, d }, z0, z1) {
    const out = [];
    for (const px of [x, x + w])
        for (const py of [y, y + d])
            for (const z of [z0, z1])
                out.push([px, py, z]);
    return out;
}
function knurl(cx, cy, radius, z0, z1, count, projection, inset = 0.4) {
    const [vx, vy] = towardViewer(projection);
    const lines = [];
    for (let index = 0; index < count; index++) {
        const angle = (index / count) * Math.PI * 2;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        if (nx * vx + ny * vy < 0.15)
            continue;
        lines.push(segment([cx + radius * nx, cy + radius * ny, z0 + inset], [cx + radius * nx, cy + radius * ny, z1 - inset], projection));
    }
    return lines.join("");
}
function sideArc(cx, cy, radius, z, projection, steps = 24) {
    const [vx, vy] = towardViewer(projection);
    const facing = Math.atan2(vy, vx);
    const points = [];
    for (let step = 0; step <= steps; step++) {
        const angle = facing - Math.PI / 2 + (step / steps) * Math.PI;
        points.push(iso([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), z], projection));
    }
    return pathOf(points);
}
function ringSeam(ring, z, projection) {
    const count = ring.length;
    const counter = signedArea(ring) > 0;
    const [vx, vy] = towardViewer(projection);
    const facing = ring.map(([ax, ay], index) => {
        const [bx, by] = ring[(index + 1) % count];
        const dx = bx - ax;
        const dy = by - ay;
        const [nx, ny] = counter ? [dy, -dx] : [-dy, dx];
        return nx * vx + ny * vy > 1e-9;
    });
    return runsOf(facing, true).map((run) => pathOf(run.map((index) => iso([ring[index][0], ring[index][1], z], projection)))).join("");
}
const sideSeam = (plan, z, projection, steps = 8) => ringSeam(ringOf(plan, steps), z, projection);
function sideRing(center, radius, axis, projection, steps = 20) {
    const [px, py, pz] = center;
    const points = [];
    for (let step = 0; step < steps; step++) {
        const angle = (step / steps) * Math.PI * 2;
        const u = radius * Math.cos(angle);
        const v = radius * Math.sin(angle);
        points.push(iso(axis === "x" ? [px, py + u, pz + v] : [px + u, py, pz + v], projection));
    }
    return pathOf(points, true);
}
function coil(from, to, center, radius, turns, axis, projection, perTurn = 16) {
    const count = Math.max(1, Math.round(turns * perTurn));
    const back = [];
    const front = [];
    let run = [];
    let near = null;
    for (let index = 0; index <= count; index++) {
        const share = index / count;
        const angle = share * turns * Math.PI * 2;
        const u = radius * Math.cos(angle);
        const v = radius * Math.sin(angle);
        const along = from + (to - from) * share;
        const point = axis === "x" ? [along, center[0] + u, center[1] + v] : [center[0] + u, along, center[1] + v];
        const normal = axis === "x" ? [0, Math.cos(angle), Math.sin(angle)] : [Math.cos(angle), 0, Math.sin(angle)];
        const facing = depthOf(normal, projection) > 0;
        const flat = iso(point, projection);
        if (near === null)
            near = facing;
        if (facing !== near) {
            run.push(flat);
            (near ? front : back).push(pathOf(run));
            run = [flat];
            near = facing;
            continue;
        }
        run.push(flat);
    }
    if (run.length > 1)
        (near ? front : back).push(pathOf(run));
    return { back: back.join(""), front: front.join("") };
}
function topTicks(from, to, step, every, edge, z, lengths, projection, axis = "x") {
    const minor = [];
    const major = [];
    const first = Math.ceil(from / step) * step;
    for (let at = first, index = Math.round(first / step); at <= to + 1e-9; at += step, index++) {
        const big = index % every === 0;
        const length = big ? lengths[1] : lengths[0];
        const a = axis === "x" ? [at, edge] : [edge, at];
        const b = axis === "x" ? [at, edge + length] : [edge + length, at];
        (big ? major : minor).push(lineOnTop(a, b, z, projection));
    }
    return { minor: minor.join(""), major: major.join("") };
}
function sideTicks(from, to, step, every, face, top, lengths, projection, axis = "x") {
    const minor = [];
    const major = [];
    const first = Math.ceil(from / step) * step;
    for (let at = first, index = Math.round(first / step); at <= to + 1e-9; at += step, index++) {
        const big = index % every === 0;
        const length = big ? lengths[1] : lengths[0];
        const a = axis === "x" ? [at, face, top] : [face, at, top];
        const b = axis === "x" ? [at, face, top - length] : [face, at, top - length];
        (big ? major : minor).push(segment(a, b, projection));
    }
    return { minor: minor.join(""), major: major.join("") };
}
function radialTicks(cx, cy, radius, count, every, z, lengths, projection, from = 0, span = Math.PI * 2) {
    const minor = [];
    const major = [];
    const closed = Math.abs(span - Math.PI * 2) < 1e-9;
    const steps = closed ? count : count + 1;
    for (let index = 0; index < steps; index++) {
        const angle = from + (index / count) * span;
        const big = index % every === 0;
        const inner = radius - (big ? lengths[1] : lengths[0]);
        const sx = Math.sin(angle);
        const sy = -Math.cos(angle);
        (big ? major : minor).push(lineOnTop([cx + sx * inner, cy + sy * inner], [cx + sx * radius, cy + sy * radius], z, projection));
    }
    return { minor: minor.join(""), major: major.join("") };
}
const haloOf = (plan, z, height, projection) => slabOf(plan, z, height, projection).fill;
function axisVector(projection, [dx, dy, dz]) {
    const origin = iso([0, 0, 0], projection);
    const moved = iso([dx, dy, dz], projection);
    return [moved[0] - origin[0], moved[1] - origin[1]];
}
const fine = (value) => Math.round(value * 100) / 100;
function translateAlong(projection, by) {
    const [x, y] = axisVector(projection, by);
    return `translate(${fine(x)} ${fine(y)})`;
}
const thousandth = (value) => Math.round(value * 1000) / 1000;
function axesAt(at, z, projection) {
    const origin = iso([at[0], at[1], z], projection);
    const along = (point) => {
        const [px, py] = iso(point, projection);
        return [px - origin[0], py - origin[1]];
    };
    return { origin, x: along([at[0] + 1, at[1], z]), y: along([at[0], at[1] + 1, z]), z: along([at[0], at[1], z + 1]) };
}
const matrixOf = (u, v, origin) => `matrix(${thousandth(u[0])} ${thousandth(u[1])} ${thousandth(v[0])} ${thousandth(v[1])} ${thousandth(origin[0])} ${thousandth(origin[1])})`;
function holdStill(element, [dx, dy]) {
    const text = dx || dy ? `translate(${-dx} ${-dy})` : "";
    element.querySelectorAll("[data-hold]").forEach((node) => (text ? node.setAttribute("transform", text) : node.removeAttribute("transform")));
}
function topMatrix(at, z, projection, along = "x") {
    const { origin, x, y } = axesAt(at, z, projection);
    return along === "x" ? matrixOf(x, y, origin) : matrixOf([-y[0], -y[1]], x, origin);
}
function sideMatrix(at, z, projection, face) {
    const { origin, x, y, z: up } = axesAt(at, z, projection);
    const down = [-up[0], -up[1]];
    return face === "left" ? matrixOf(x, down, origin) : matrixOf([-y[0], -y[1]], down, origin);
}
function screenRise(height, projection) {
    const { cosE, k } = cameraOf(projection);
    return height * cosE * k;
}
function fitProjection(points, width, height, { pad = 24, headroom = 0, azimuth = AZIMUTH, elevation = ELEVATION } = {}) {
    const unit = { origin: [0, 0], scale: 1, azimuth, elevation };
    const flat = points.map((point) => iso(point, unit));
    const xs = flat.map(([x]) => x);
    const ys = flat.map(([, y]) => y);
    const left = Math.min(...xs);
    const right = Math.max(...xs);
    const up = Math.min(...ys);
    const down = Math.max(...ys);
    const scale = Math.min((width - pad * 2) / (right - left), (height - pad * 2 - headroom) / (down - up));
    return {
        origin: [width / 2 - ((left + right) / 2) * scale, headroom + (height - headroom) / 2 - ((up + down) / 2) * scale],
        scale,
        azimuth,
        elevation,
    };
}
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attrs = (pairs) => Object.entries(pairs)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([key, value]) => ` ${key}="${escape(String(value))}"`)
    .join("");
function solidSvg(paths, { tone = "hi", crease = "faint", halo = false, lit = false, flat = false, className, inner = "" } = {}) {
    const parts = [];
    if (halo)
        parts.push(`<path class="iso-halo" d="${paths.fill}"/>`);
    parts.push(`<path class="iso-fill" d="${paths.fill}"/>`);
    if (!flat) {
        paths.shades.forEach((d, shade) => {
            if (d)
                parts.push(`<path class="iso-shade" data-shade="${shade}" d="${d}"/>`);
        });
        parts.push(`<path class="iso-top" d="${paths.top}"/>`);
    }
    if (crease !== "none" && paths.crease)
        parts.push(`<path class="iso-line iso-crease" data-tone="${crease}" d="${paths.crease}"/>`);
    if (crease !== "none" && paths.bevel)
        parts.push(`<path class="iso-line iso-bevel" data-tone="${crease}" d="${paths.bevel}"/>`);
    if (inner)
        parts.push(inner);
    parts.push(`<path class="iso-line iso-edge" data-tone="${tone}" d="${paths.outline}"/>`);
    return `<g${attrs({ class: className ? `iso-solid ${className}` : "iso-solid", "data-lit": lit ? "" : undefined, "data-seamless": paths.seamless ? "" : undefined })}>${parts.join("")}</g>`;
}
function lineSvg(d, { tone = "lo", dotted = false, dashed = false, flow = false, className, free } = {}) {
    if (!d)
        return "";
    return `<path${attrs({
        class: className ? `iso-line ${className}` : "iso-line",
        "data-tone": tone,
        "data-free": free === true ? "" : free || undefined,
        "data-dotted": dotted ? "" : undefined,
        "data-dashed": dashed ? "" : undefined,
        "data-flow": flow ? "" : undefined,
        d,
    })}/>`;
}
function dotsSvg(points, { size = 0.5, tone = "mid", pulse = false } = {}) {
    const dots = points
        .map(([x, y, alpha], index) => `<circle cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"${alpha !== undefined && alpha < 1 ? ` fill-opacity="${Math.max(0, alpha).toFixed(2)}"` : ""}${pulse ? ` data-pulse="" style="--pulse-at:${(index * 137) % 1600}ms"` : ""}/>`)
        .join("");
    return `<g class="iso-dots" data-tone="${tone}">${dots}</g>`;
}
function fadedSvg(list, style = {}) {
    const groups = new Map();
    for (const entry of list) {
        const [d, alpha] = Array.isArray(entry) ? entry : [entry.d, entry.alpha];
        if (!d || !(alpha > 0.02))
            continue;
        const level = Math.min(1, Math.round(alpha * 20) / 20);
        groups.set(level, (groups.get(level) ?? "") + d);
    }
    return [...groups].map(([alpha, d]) => (alpha >= 1 ? lineSvg(d, style) : `<g opacity="${alpha.toFixed(2)}">${lineSvg(d, style)}</g>`)).join("");
}
function fadeLineSvg(points, { fade = [0, 0], tone = "lo", className, stops = 6 } = {}) {
    if (points.length < 2)
        return "";
    const ease = (t) => t * t * (3 - 2 * t);
    const hashOf = (text) => {
        let hash = 2166136261;
        for (let index = 0; index < text.length; index++)
            hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
        return (hash >>> 0).toString(36);
    };
    const lengths = [0];
    for (let index = 1; index < points.length; index++)
        lengths.push(lengths[index - 1] + Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]));
    const at = (length) => {
        let index = 1;
        while (index < points.length - 1 && lengths[index] < length)
            index++;
        const span = lengths[index] - lengths[index - 1] || 1;
        const t = Math.max(0, Math.min(1, (length - lengths[index - 1]) / span));
        return [points[index - 1][0] + (points[index][0] - points[index - 1][0]) * t, points[index - 1][1] + (points[index][1] - points[index - 1][1]) * t];
    };
    const pieceOf = (from, to) => [at(from), ...points.filter((_, index) => lengths[index] > from + 1e-6 && lengths[index] < to - 1e-6), at(to)];
    const total = lengths[lengths.length - 1];
    if (total < 1e-6)
        return "";
    let [start, end] = Array.isArray(fade) ? fade : [fade, fade];
    if (start + end > total) {
        const share = total / (start + end);
        start *= share;
        end *= share;
    }
    const paint = `var(--anatomy-${tone})`;
    const ramp = (piece, rising) => {
        const d = pathOf(piece);
        const [x1, y1] = piece[0];
        const [x2, y2] = piece[piece.length - 1];
        const id = `iso-fade-${hashOf(`${d}|${tone}|${rising}`)}`;
        const marks = Array.from({ length: stops + 1 }, (_, index) => {
            const t = index / stops;
            const alpha = ease(rising ? t : 1 - t);
            return `<stop offset="${t.toFixed(3)}" stop-opacity="${alpha.toFixed(3)}" style="stop-color:${paint}"/>`;
        }).join("");
        const gradient = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${tenth(x1)}" y1="${tenth(y1)}" x2="${tenth(x2)}" y2="${tenth(y2)}">${marks}</linearGradient>`;
        return `<defs>${gradient}</defs><path${attrs({ class: className ? `iso-line ${className}` : "iso-line", "data-tone": tone, "data-free": rising ? "start" : "end", d, style: `stroke:url(#${id})` })}/>`;
    };
    const parts = [];
    if (start > 0.05)
        parts.push(ramp(pieceOf(0, start), true));
    if (total - end - start > 0.05)
        parts.push(lineSvg(pathOf(pieceOf(start, total - end)), { tone, className }));
    if (end > 0.05)
        parts.push(ramp(pieceOf(total - end, total), false));
    return `<g class="iso-fade">${parts.join("")}</g>`;
}
function wireSvg(from, to, { via = [], tone = "lo", dotted = false, dashed = false, flow = false, ends = "both", size = 1.2 } = {}) {
    const d = pathOf([from, ...via, to]);
    const end = ([x, y]) => `<circle class="iso-wire-end" cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"/>`;
    return `<g class="iso-wire" data-tone="${tone}">${lineSvg(d, { tone, dotted, dashed, flow })}${ends === "both" || ends === "from" ? end(from) : ""}${ends === "both" || ends === "to" ? end(to) : ""}</g>`;
}
function faceTextSvg(transform, text, { size = 3, tone = "mid", anchor = "start" } = {}) {
    return `<text class="iso-face-text" data-tone="${tone}" transform="${transform}" font-size="${size}" text-anchor="${anchor}">${escape(text)}</text>`;
}
function groupSvg(children, extra = {}) {
    return `<g${attrs(extra)}>${Array.isArray(children) ? children.join("") : children}</g>`;
}
function figureSvg({ width, height, label, body, standalone = false, className }) {
    const style = standalone ? `<style>${ISO_CSS}</style>` : "";
    return `<svg${attrs({
        xmlns: "http://www.w3.org/2000/svg",
        class: `iso-svg${standalone ? " iso" : ""}${className ? ` ${className}` : ""}`,
        "data-theme": standalone || undefined,
        viewBox: `0 0 ${width} ${height}`,
        role: "img",
        "aria-label": label,
    })}>${style}${Array.isArray(body) ? body.join("") : body}</svg>`;
}
function swatchSvg(mark) {
    if (mark === "raised" || mark === "flat" || mark === "lit") {
        const body = mark === "flat" ? "M2 6.5 8 3.5 14 6.5 8 9.5Z" : "M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z";
        const crease = mark === "flat" ? "" : `<path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/>`;
        return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="${body}"/>${crease}</svg>`;
    }
    return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="M1.5 5h13"/></svg>`;
}
function plateHtml({ fig, title, hint, readout = "", keys = [], caption, body }) {
    const corner = (name, text, extra = "") => `<span class="iso-plate-corner" data-corner="${name}"${extra}>${escape(text)}</span>`;
    const legend = keys.length || caption
        ? `<figcaption class="iso-legend">${keys.length ? `<span class="iso-keys">${keys.map((key) => `<span class="iso-key">${swatchSvg(key.mark)}${escape(key.label)}</span>`).join("")}</span>` : ""}${caption ? `<span class="iso-caption">${escape(caption)}</span>` : ""}</figcaption>`
        : "";
    return `<figure class="iso-figure"><div class="iso-plate"><div class="iso-plate-corners" aria-hidden="true">${corner("fig", fig)}${title ? corner("title", title) : ""}${hint ? corner("hint", hint) : ""}${corner("readout", readout, " data-readout")}</div>${body}</div>${legend}</figure>`;
}
function pageHtml({ title, theme = "dark", body, script = "", width = 650 }) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><style>${ISO_CSS}${PAGE_CSS.replace("__WIDTH__", String(width))}</style></head><body class="iso" data-theme="${theme}"><main class="iso-page">${body}</main>${script ? `<script type="module">${script.replace(/<\/(script)/gi, "<\\/$1")}</script>` : ""}</body></html>`;
}
const PAGE_CSS = `
*{box-sizing:border-box}
html{color-scheme:dark}
body[data-theme="light"]{color-scheme:light}
body{margin:0;background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.iso-page{width:min(__WIDTH__px,100% - 32px);margin:64px auto 96px}
`;
const ISO_CSS = `
.iso{
  --anatomy-page:#0b0b0b;--anatomy-card:#131313;--anatomy-text:#a3a3a3;--anatomy-strong:#e6e6e6;--anatomy-muted:#6e6e6e;
  --anatomy-paper:#131313;--anatomy-face:#1b1b1b;--anatomy-top:#1c1c1c;
  --anatomy-shade-0:#0f0f0f;--anatomy-shade-1:#121212;--anatomy-shade-2:#151515;--anatomy-shade-3:#181818;
  --anatomy-lit-top:#262626;--anatomy-lit-shade:#1d1d1d;
  --anatomy-hi:#d4d4d4;--anatomy-mid:#6a6a6a;--anatomy-lo:#3e3e3e;--anatomy-faint:#2a2a2a;--anatomy-lit:#ffffff;
  --anatomy-halo:#050505;--anatomy-halo-opacity:.9;--anatomy-dot:#e6e6e6;
  --anatomy-red:#ff6b6b;--anatomy-green:#6be0a0;--anatomy-blue:#6b9bff;
  --anatomy-weight:.6px;--anatomy-ease:cubic-bezier(.32,.72,0,1);
  --anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --anatomy-lift:inset 0 1px 0 0 #ffffff0a,inset 0 0 0 1px #ffffff06,0 0 0 1px #00000026,0 1px 1px -.5px #00000014,0 3px 3px -1.5px #00000014,0 6px 6px -3px #00000014,0 12px 12px -6px #00000014;
}
.iso[data-theme="light"]{
  --anatomy-page:#f2f2ef;--anatomy-card:#fbfbfa;--anatomy-text:#57575a;--anatomy-strong:#18181a;--anatomy-muted:#8c8c90;
  --anatomy-paper:#fbfbfa;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#dcdcd9;--anatomy-shade-1:#e5e5e2;--anatomy-shade-2:#ededea;--anatomy-shade-3:#f4f4f1;
  --anatomy-lit-top:#ffffff;--anatomy-lit-shade:#eeeeeb;
  --anatomy-hi:#26262a;--anatomy-mid:#8a8a8f;--anatomy-lo:#b4b4b8;--anatomy-faint:#d4d4d6;--anatomy-lit:#000000;
  --anatomy-halo:#8a8a80;--anatomy-halo-opacity:.32;--anatomy-dot:#3a3a3e;
  --anatomy-red:#e5484d;--anatomy-green:#30a46c;--anatomy-blue:#3e63dd;
  --anatomy-lift:inset 0 1px 0 0 #ffffff,0 0 0 1px #0000000f,0 1px 1px -.5px #0000000a,0 3px 3px -1.5px #0000000a,0 6px 6px -3px #0000000a,0 12px 12px -6px #0000000a;
}
.iso-svg{display:block;width:100%;height:auto;overflow:visible}
.iso-svg path,.iso-svg circle{vector-effect:non-scaling-stroke}
.iso-fill{fill:var(--anatomy-paper);stroke:none}
.iso-solid[data-lit]>.iso-fill{fill:var(--anatomy-face)}
.iso-shade,.iso-top{stroke:none}
.iso-shade[data-shade="0"]{fill:var(--anatomy-shade-0)}
.iso-shade[data-shade="1"]{fill:var(--anatomy-shade-1)}
.iso-shade[data-shade="2"]{fill:var(--anatomy-shade-2)}
.iso-shade[data-shade="3"]{fill:var(--anatomy-shade-3)}
.iso-top{fill:var(--anatomy-top)}
.iso-solid[data-lit]>.iso-top{fill:var(--anatomy-lit-top)}
.iso-solid[data-lit]>.iso-shade{fill:var(--anatomy-lit-shade)}
.iso-solid[data-seamless]>.iso-shade,.iso-solid[data-seamless]>.iso-top{stroke-width:.4;stroke-linejoin:round}
.iso-solid[data-seamless]>.iso-shade[data-shade="0"]{stroke:var(--anatomy-shade-0)}
.iso-solid[data-seamless]>.iso-shade[data-shade="1"]{stroke:var(--anatomy-shade-1)}
.iso-solid[data-seamless]>.iso-shade[data-shade="2"]{stroke:var(--anatomy-shade-2)}
.iso-solid[data-seamless]>.iso-shade[data-shade="3"]{stroke:var(--anatomy-shade-3)}
.iso-solid[data-seamless]>.iso-top{stroke:var(--anatomy-top)}
.iso-solid[data-seamless][data-lit]>.iso-top{stroke:var(--anatomy-lit-top)}
.iso-solid[data-seamless][data-lit]>.iso-shade{stroke:var(--anatomy-lit-shade)}
.iso-solid[data-lit]>.iso-edge{stroke:var(--anatomy-lit)}
.iso-halo{fill:var(--anatomy-halo);stroke:none;filter:blur(9px);opacity:var(--anatomy-halo-opacity);transform:translateY(3px)}
.iso-line{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linecap:round;stroke-linejoin:round}
.iso-line[data-tone="hi"]{stroke:var(--anatomy-hi)}
.iso-line[data-tone="mid"]{stroke:var(--anatomy-mid)}
.iso-line[data-tone="lo"]{stroke:var(--anatomy-lo)}
.iso-line[data-tone="faint"]{stroke:var(--anatomy-faint)}
.iso-line[data-tone="lit"]{stroke:var(--anatomy-lit)}
.iso-line[data-tone="red"]{stroke:var(--anatomy-red)}
.iso-line[data-tone="green"]{stroke:var(--anatomy-green)}
.iso-line[data-tone="blue"]{stroke:var(--anatomy-blue)}
.iso-line[data-dotted]{stroke-dasharray:.01 3.5;stroke-width:1}
.iso-line[data-dashed]{stroke-dasharray:3 3}
.iso-line[data-flow]{stroke-dasharray:2 6}
.iso-wire-end{fill:var(--anatomy-paper);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso-wire[data-tone="hi"] .iso-wire-end{stroke:var(--anatomy-hi)}
.iso-wire[data-tone="mid"] .iso-wire-end{stroke:var(--anatomy-mid)}
.iso-wire[data-tone="faint"] .iso-wire-end{stroke:var(--anatomy-faint)}
.iso-wire[data-tone="lit"] .iso-wire-end{stroke:var(--anatomy-lit)}
.iso-dots circle{fill:var(--anatomy-dot);stroke:none;opacity:.32}
.iso-dots[data-tone="hi"] circle{opacity:.85}
.iso-dots[data-tone="mid"] circle{opacity:.45}
.iso-dots[data-tone="lo"] circle{opacity:.22}
.iso-dots[data-tone="faint"] circle{opacity:.12}
.iso-face-text{fill:var(--anatomy-mid);font-family:var(--anatomy-mono);letter-spacing:.04em}
.iso-face-text[data-tone="hi"]{fill:var(--anatomy-hi)}
.iso-face-text[data-tone="lo"]{fill:var(--anatomy-lo)}
.iso-face-text[data-tone="faint"]{fill:var(--anatomy-faint)}
.tb-body{fill:var(--anatomy-shade-2);stroke:none}
.tb-shine{fill:var(--anatomy-top);stroke:none}
.tb-shade{fill:var(--anatomy-shade-0);stroke:none}
.tb-ring{fill:none;stroke:var(--anatomy-lo);stroke-width:.45;stroke-linecap:butt;stroke-linejoin:round}
.tb-ring[data-tone="mid"]{stroke:var(--anatomy-mid)}
.tb-ring[data-tone="faint"]{stroke:var(--anatomy-faint)}
.tb-ring[data-tone="hi"]{stroke:var(--anatomy-hi)}
@keyframes iso-flow{to{stroke-dashoffset:-32}}
@keyframes iso-pulse{0%,100%{opacity:.18}12%{opacity:1}40%{opacity:.18}}
.iso-line[data-flow]{animation:iso-flow 1600ms linear infinite}
.iso-dots circle[data-pulse]{animation:iso-pulse 1600ms steps(1,end) infinite;animation-delay:var(--pulse-at,0ms)}
.iso-figure{margin:32px 0 36px}
.iso-plate{position:relative;padding:52px 24px;border-radius:0;background:var(--anatomy-card);box-shadow:0 0 0 1px var(--anatomy-mid);--anatomy-paper:var(--anatomy-card)}
.iso-plate-corners{position:absolute;inset:18px 20px;pointer-events:none}
.iso-plate-corner{position:absolute;color:var(--anatomy-muted);font-family:var(--anatomy-mono);font-size:10.5px;line-height:1;letter-spacing:.04em;white-space:nowrap}
.iso-plate-corner[data-corner="fig"]{top:0;left:0;color:var(--anatomy-text)}
.iso-plate-corner[data-corner="title"]{top:0;right:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="hint"]{bottom:0;left:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="readout"]{right:0;bottom:0;color:var(--anatomy-text);font-variant-numeric:tabular-nums}
.iso-plate .iso-svg{margin:0 auto}
.iso-legend{display:grid;gap:8px;margin-top:12px;color:var(--anatomy-muted);font-size:13px;line-height:1.55}
.iso-keys{display:flex;flex-wrap:wrap;gap:6px 18px}
.iso-key{display:inline-flex;align-items:center;gap:7px}
.iso-swatch{width:16px;height:10px;flex:none;overflow:visible}
.iso-swatch path{fill:none;stroke:var(--anatomy-hi);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.iso-swatch[data-mark="raised"] path,.iso-swatch[data-mark="flat"] path{stroke:var(--anatomy-mid)}
.iso-swatch[data-mark="lit"] path{stroke:var(--anatomy-lit)}
.iso-swatch[data-mark="dim"] path{stroke:var(--anatomy-lo)}
.iso-swatch[data-mark="dotted"] path{stroke-dasharray:.01 3;stroke-width:1.4}
.iso-swatch[data-mark="dashed"] path{stroke-dasharray:3 2.5}
.iso-swatch[data-mark="red"] path{stroke:var(--anatomy-red)}
.iso-swatch[data-mark="green"] path{stroke:var(--anatomy-green)}
.iso-swatch[data-mark="blue"] path{stroke:var(--anatomy-blue)}
.iso-swatch-crease{stroke:var(--anatomy-lo)!important}
@media (max-width:560px){.iso-plate{padding:48px 12px 70px}.iso-plate-corner[data-corner="hint"]{bottom:18px}}
@media (prefers-reduced-motion:reduce){.iso-line[data-flow],.iso-dots circle[data-pulse]{animation:none}}
`;

  Lab.Iso = { iso: iso, depthOf: depthOf, translateAlong: translateAlong, lineOnTop: lineOnTop, onTop: onTop, extrude: extrude, solidSvg: solidSvg, cylinder: cylinder, slabOf: slabOf };
  Lab.BacklogArt = {
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"iso-svg bk-svg\" viewBox=\"0 0 760 470\" role=\"img\" aria-label=\"The backlog machine. SYN tokens drop from a hopper onto a conveyor and ride to a cabinet of 100 pigeonholes, the server's half-open connection queue. Each token that gets in hangs a tag on a free hook: blue for a real client, dark for a spoofed attack SYN. Real clients take their tag back a moment later; attack tags hang until the timeout timer clears them. When every hook is full the intake gate drops and new tokens fall into the reject tray. Over the belt, a firewall screen, a rate-limit turnstile and a SYN-cookie stamp press come into play when those defences are switched on.\"><path class=\"iso-halo\" d=\"M170.8 240.5L171 239.5L171.5 238.5L172.4 237.5L173.6 236.7L175.1 236.1L298.9 191.1L300.6 190.6L302.5 190.3L304.6 190.1L306.6 190.2L308.6 190.4L310.4 190.9L312.1 191.5L313.4 192.3L587.2 380.7L588.2 381.5L588.9 382.5L589.2 383.5L589.2 395.6L589 396.6L588.5 397.6L587.6 398.5L586.4 399.3L584.9 400L461.1 444.9L459.4 445.5L457.5 445.8L455.4 445.9L453.4 445.9L451.4 445.6L449.6 445.2L447.9 444.5L446.6 443.8L172.8 255.4L171.8 254.5L171.1 253.5L170.8 252.5Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M291.9 217.5L292.2 216.5L293 215.5L294.2 214.6L295.7 213.9L297.5 213.4L299.5 213.1L301.6 213.1L303.6 213.2L305.5 213.6L307.2 214.2L308.6 215L309.7 215.9L310.3 216.9L310.4 217.9L310.4 219.7L310.1 220.7L309.3 221.7L308.1 222.6L306.6 223.3L304.8 223.8L302.8 224.1L300.7 224.1L298.7 224L296.7 223.6L295 223L293.6 222.2L292.6 221.3L292 220.3L291.9 219.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M310.4 219.7L310.1 220.7L310.1 218.9L310.4 217.9ZM310.1 220.7L309.3 221.7L309.3 219.9L310.1 218.9ZM309.3 221.7L308.1 222.6L308.1 220.7L309.3 219.9ZM308.1 222.6L306.6 223.3L306.6 221.4L308.1 220.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M306.6 223.3L304.8 223.8L304.8 222L306.6 221.4ZM304.8 223.8L302.8 224.1L302.8 222.3L304.8 222ZM302.8 224.1L300.7 224.1L300.7 222.3L302.8 222.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M300.7 224.1L298.7 224L298.7 222.2L300.7 222.3ZM298.7 224L296.7 223.6L296.7 221.8L298.7 222.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M296.7 223.6L295 223L295 221.2L296.7 221.8ZM295 223L293.6 222.2L293.6 220.4L295 221.2ZM293.6 222.2L292.6 221.3L292.6 219.5L293.6 220.4ZM292.6 221.3L292 220.3L292 218.5L292.6 219.5ZM292 220.3L291.9 219.3L291.9 217.5L292 218.5Z\"/><path class=\"iso-top\" d=\"M306.6 221.4L304.8 222L302.8 222.3L300.7 222.3L298.7 222.2L296.7 221.8L295 221.2L293.6 220.4L292.6 219.5L292 218.5L291.9 217.5L292.2 216.5L293 215.5L294.2 214.6L295.7 213.9L297.5 213.4L299.5 213.1L301.6 213.1L303.6 213.2L305.5 213.6L307.2 214.2L308.6 215L309.7 215.9L310.3 216.9L310.4 217.9L310.1 218.9L309.3 219.9L308.1 220.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M310.4 217.9L310.1 218.9L309.3 219.9L308.1 220.7L306.6 221.4L304.8 222L302.8 222.3L300.7 222.3L298.7 222.2L296.7 221.8L295 221.2L293.6 220.4L292.6 219.5L292 218.5L291.9 217.5\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M291.9 217.5L292.2 216.5L293 215.5L294.2 214.6L295.7 213.9L297.5 213.4L299.5 213.1L301.6 213.1L303.6 213.2L305.5 213.6L307.2 214.2L308.6 215L309.7 215.9L310.3 216.9L310.4 217.9M310.4 219.7L310.1 220.7L309.3 221.7L308.1 222.6L306.6 223.3L304.8 223.8L302.8 224.1L300.7 224.1L298.7 224L296.7 223.6L295 223L293.6 222.2L292.6 221.3L292 220.3L291.9 219.3M291.9 217.5L291.9 219.3M310.4 217.9L310.4 219.7\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M294 213.3L294.2 212.5L294.8 211.8L295.7 211.1L296.9 210.6L298.3 210.2L299.9 210L301.5 209.9L303 210L304.5 210.3L305.9 210.8L306.9 211.4L307.7 212.1L308.2 212.8L308.3 213.6L308.3 217.9L308.1 218.7L307.5 219.4L306.5 220.1L305.4 220.6L304 221L302.4 221.2L300.8 221.3L299.2 221.2L297.7 220.9L296.4 220.4L295.3 219.8L294.5 219.1L294.1 218.3L294 217.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M308.3 217.9L308.1 218.7L308.1 214.4L308.3 213.6ZM308.1 218.7L307.5 219.4L307.5 215.2L308.1 214.4ZM307.5 219.4L306.5 220.1L306.5 215.8L307.5 215.2ZM306.5 220.1L305.4 220.6L305.4 216.4L306.5 215.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M305.4 220.6L304 221L304 216.8L305.4 216.4ZM304 221L302.4 221.2L302.4 217L304 216.8ZM302.4 221.2L300.8 221.3L300.8 217.1L302.4 217Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M300.8 221.3L299.2 221.2L299.2 216.9L300.8 217.1ZM299.2 221.2L297.7 220.9L297.7 216.6L299.2 216.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M297.7 220.9L296.4 220.4L296.4 216.2L297.7 216.6ZM296.4 220.4L295.3 219.8L295.3 215.6L296.4 216.2ZM295.3 219.8L294.5 219.1L294.5 214.9L295.3 215.6ZM294.5 219.1L294.1 218.3L294.1 214.1L294.5 214.9ZM294.1 218.3L294 217.5L294 213.3L294.1 214.1Z\"/><path class=\"iso-top\" d=\"M305.4 216.4L304 216.8L302.4 217L300.8 217.1L299.2 216.9L297.7 216.6L296.4 216.2L295.3 215.6L294.5 214.9L294.1 214.1L294 213.3L294.2 212.5L294.8 211.8L295.7 211.1L296.9 210.6L298.3 210.2L299.9 210L301.5 209.9L303 210L304.5 210.3L305.9 210.8L306.9 211.4L307.7 212.1L308.2 212.8L308.3 213.6L308.1 214.4L307.5 215.2L306.5 215.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M308.3 213.6L308.1 214.4L307.5 215.2L306.5 215.8L305.4 216.4L304 216.8L302.4 217L300.8 217.1L299.2 216.9L297.7 216.6L296.4 216.2L295.3 215.6L294.5 214.9L294.1 214.1L294 213.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M294 213.3L294.2 212.5L294.8 211.8L295.7 211.1L296.9 210.6L298.3 210.2L299.9 210L301.5 209.9L303 210L304.5 210.3L305.9 210.8L306.9 211.4L307.7 212.1L308.2 212.8L308.3 213.6M308.3 217.9L308.1 218.7L307.5 219.4L306.5 220.1L305.4 220.6L304 221L302.4 221.2L300.8 221.3L299.2 221.2L297.7 220.9L296.4 220.4L295.3 219.8L294.5 219.1L294.1 218.3L294 217.5M294 213.3L294 217.5M308.3 213.6L308.3 217.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M196.3 252.2L196.6 251.2L197.4 250.2L198.5 249.4L200.1 248.7L201.9 248.2L203.9 247.9L205.9 247.8L208 248L209.9 248.3L211.6 248.9L213 249.7L214.1 250.6L214.6 251.6L214.8 252.6L214.8 254.4L214.5 255.5L213.7 256.4L212.5 257.3L211 258L209.2 258.5L207.2 258.8L205.1 258.9L203.1 258.7L201.1 258.3L199.4 257.7L198 257L197 256.1L196.4 255.1L196.3 254Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M214.8 254.4L214.5 255.5L214.5 253.7L214.8 252.6ZM214.5 255.5L213.7 256.4L213.7 254.6L214.5 253.7ZM213.7 256.4L212.5 257.3L212.5 255.5L213.7 254.6ZM212.5 257.3L211 258L211 256.2L212.5 255.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M211 258L209.2 258.5L209.2 256.7L211 256.2ZM209.2 258.5L207.2 258.8L207.2 257L209.2 256.7ZM207.2 258.8L205.1 258.9L205.1 257.1L207.2 257Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M205.1 258.9L203.1 258.7L203.1 256.9L205.1 257.1ZM203.1 258.7L201.1 258.3L201.1 256.5L203.1 256.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M201.1 258.3L199.4 257.7L199.4 255.9L201.1 256.5ZM199.4 257.7L198 257L198 255.2L199.4 255.9ZM198 257L197 256.1L197 254.3L198 255.2ZM197 256.1L196.4 255.1L196.4 253.3L197 254.3ZM196.4 255.1L196.3 254L196.3 252.2L196.4 253.3Z\"/><path class=\"iso-top\" d=\"M211 256.2L209.2 256.7L207.2 257L205.1 257.1L203.1 256.9L201.1 256.5L199.4 255.9L198 255.2L197 254.3L196.4 253.3L196.3 252.2L196.6 251.2L197.4 250.2L198.5 249.4L200.1 248.7L201.9 248.2L203.9 247.9L205.9 247.8L208 248L209.9 248.3L211.6 248.9L213 249.7L214.1 250.6L214.6 251.6L214.8 252.6L214.5 253.7L213.7 254.6L212.5 255.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M214.8 252.6L214.5 253.7L213.7 254.6L212.5 255.5L211 256.2L209.2 256.7L207.2 257L205.1 257.1L203.1 256.9L201.1 256.5L199.4 255.9L198 255.2L197 254.3L196.4 253.3L196.3 252.2\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M196.3 252.2L196.6 251.2L197.4 250.2L198.5 249.4L200.1 248.7L201.9 248.2L203.9 247.9L205.9 247.8L208 248L209.9 248.3L211.6 248.9L213 249.7L214.1 250.6L214.6 251.6L214.8 252.6M214.8 254.4L214.5 255.5L213.7 256.4L212.5 257.3L211 258L209.2 258.5L207.2 258.8L205.1 258.9L203.1 258.7L201.1 258.3L199.4 257.7L198 257L197 256.1L196.4 255.1L196.3 254M196.3 252.2L196.3 254M214.8 252.6L214.8 254.4\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M198.4 248.1L198.6 247.3L199.2 246.5L200.1 245.9L201.3 245.3L202.7 244.9L204.2 244.7L205.9 244.6L207.4 244.8L208.9 245.1L210.3 245.5L211.3 246.1L212.1 246.8L212.6 247.6L212.7 248.4L212.7 252.6L212.5 253.4L211.9 254.1L210.9 254.8L209.8 255.3L208.4 255.7L206.8 256L205.2 256L203.6 255.9L202.1 255.6L200.8 255.1L199.7 254.5L198.9 253.8L198.5 253.1L198.4 252.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M212.7 252.6L212.5 253.4L212.5 249.2L212.7 248.4ZM212.5 253.4L211.9 254.1L211.9 249.9L212.5 249.2ZM211.9 254.1L210.9 254.8L210.9 250.6L211.9 249.9ZM210.9 254.8L209.8 255.3L209.8 251.1L210.9 250.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M209.8 255.3L208.4 255.7L208.4 251.5L209.8 251.1ZM208.4 255.7L206.8 256L206.8 251.7L208.4 251.5ZM206.8 256L205.2 256L205.2 251.8L206.8 251.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M205.2 256L203.6 255.9L203.6 251.7L205.2 251.8ZM203.6 255.9L202.1 255.6L202.1 251.4L203.6 251.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M202.1 255.6L200.8 255.1L200.8 250.9L202.1 251.4ZM200.8 255.1L199.7 254.5L199.7 250.3L200.8 250.9ZM199.7 254.5L198.9 253.8L198.9 249.6L199.7 250.3ZM198.9 253.8L198.5 253.1L198.5 248.9L198.9 249.6ZM198.5 253.1L198.4 252.3L198.4 248.1L198.5 248.9Z\"/><path class=\"iso-top\" d=\"M209.8 251.1L208.4 251.5L206.8 251.7L205.2 251.8L203.6 251.7L202.1 251.4L200.8 250.9L199.7 250.3L198.9 249.6L198.5 248.9L198.4 248.1L198.6 247.3L199.2 246.5L200.1 245.9L201.3 245.3L202.7 244.9L204.2 244.7L205.9 244.6L207.4 244.8L208.9 245.1L210.3 245.5L211.3 246.1L212.1 246.8L212.6 247.6L212.7 248.4L212.5 249.2L211.9 249.9L210.9 250.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M212.7 248.4L212.5 249.2L211.9 249.9L210.9 250.6L209.8 251.1L208.4 251.5L206.8 251.7L205.2 251.8L203.6 251.7L202.1 251.4L200.8 250.9L199.7 250.3L198.9 249.6L198.5 248.9L198.4 248.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M198.4 248.1L198.6 247.3L199.2 246.5L200.1 245.9L201.3 245.3L202.7 244.9L204.2 244.7L205.9 244.6L207.4 244.8L208.9 245.1L210.3 245.5L211.3 246.1L212.1 246.8L212.6 247.6L212.7 248.4M212.7 252.6L212.5 253.4L211.9 254.1L210.9 254.8L209.8 255.3L208.4 255.7L206.8 256L205.2 256L203.6 255.9L202.1 255.6L200.8 255.1L199.7 254.5L198.9 253.8L198.5 253.1L198.4 252.3M198.4 248.1L198.4 252.3M212.7 248.4L212.7 252.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M545.2 391.8L545.5 390.8L546.3 389.8L547.5 389L549 388.3L550.8 387.8L552.8 387.5L554.9 387.4L556.9 387.6L558.9 388L560.6 388.6L562 389.3L563 390.2L563.6 391.2L563.7 392.3L563.7 394.1L563.4 395.1L562.6 396L561.5 396.9L559.9 397.6L558.1 398.1L556.1 398.4L554.1 398.5L552 398.3L550.1 397.9L548.4 397.3L547 396.6L545.9 395.7L545.4 394.7L545.2 393.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M563.7 394.1L563.4 395.1L563.4 393.3L563.7 392.3ZM563.4 395.1L562.6 396L562.6 394.2L563.4 393.3ZM562.6 396L561.5 396.9L561.5 395.1L562.6 394.2ZM561.5 396.9L559.9 397.6L559.9 395.8L561.5 395.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M559.9 397.6L558.1 398.1L558.1 396.3L559.9 395.8ZM558.1 398.1L556.1 398.4L556.1 396.6L558.1 396.3ZM556.1 398.4L554.1 398.5L554.1 396.7L556.1 396.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M554.1 398.5L552 398.3L552 396.5L554.1 396.7ZM552 398.3L550.1 397.9L550.1 396.1L552 396.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M550.1 397.9L548.4 397.3L548.4 395.5L550.1 396.1ZM548.4 397.3L547 396.6L547 394.8L548.4 395.5ZM547 396.6L545.9 395.7L545.9 393.9L547 394.8ZM545.9 395.7L545.4 394.7L545.4 392.9L545.9 393.9ZM545.4 394.7L545.2 393.6L545.2 391.8L545.4 392.9Z\"/><path class=\"iso-top\" d=\"M559.9 395.8L558.1 396.3L556.1 396.6L554.1 396.7L552 396.5L550.1 396.1L548.4 395.5L547 394.8L545.9 393.9L545.4 392.9L545.2 391.8L545.5 390.8L546.3 389.8L547.5 389L549 388.3L550.8 387.8L552.8 387.5L554.9 387.4L556.9 387.6L558.9 388L560.6 388.6L562 389.3L563 390.2L563.6 391.2L563.7 392.3L563.4 393.3L562.6 394.2L561.5 395.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M563.7 392.3L563.4 393.3L562.6 394.2L561.5 395.1L559.9 395.8L558.1 396.3L556.1 396.6L554.1 396.7L552 396.5L550.1 396.1L548.4 395.5L547 394.8L545.9 393.9L545.4 392.9L545.2 391.8\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M545.2 391.8L545.5 390.8L546.3 389.8L547.5 389L549 388.3L550.8 387.8L552.8 387.5L554.9 387.4L556.9 387.6L558.9 388L560.6 388.6L562 389.3L563 390.2L563.6 391.2L563.7 392.3M563.7 394.1L563.4 395.1L562.6 396L561.5 396.9L559.9 397.6L558.1 398.1L556.1 398.4L554.1 398.5L552 398.3L550.1 397.9L548.4 397.3L547 396.6L545.9 395.7L545.4 394.7L545.2 393.6M545.2 391.8L545.2 393.6M563.7 392.3L563.7 394.1\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M547.3 387.7L547.5 386.9L548.1 386.1L549.1 385.5L550.2 384.9L551.6 384.5L553.2 384.3L554.8 384.2L556.4 384.4L557.9 384.7L559.2 385.1L560.3 385.7L561.1 386.4L561.5 387.2L561.6 388L561.6 392.2L561.4 393L560.8 393.7L559.9 394.4L558.7 394.9L557.3 395.3L555.8 395.6L554.1 395.6L552.6 395.5L551.1 395.2L549.7 394.7L548.7 394.2L547.9 393.5L547.4 392.7L547.3 391.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M561.6 392.2L561.4 393L561.4 388.8L561.6 388ZM561.4 393L560.8 393.7L560.8 389.5L561.4 388.8ZM560.8 393.7L559.9 394.4L559.9 390.2L560.8 389.5ZM559.9 394.4L558.7 394.9L558.7 390.7L559.9 390.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M558.7 394.9L557.3 395.3L557.3 391.1L558.7 390.7ZM557.3 395.3L555.8 395.6L555.8 391.4L557.3 391.1ZM555.8 395.6L554.1 395.6L554.1 391.4L555.8 391.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M554.1 395.6L552.6 395.5L552.6 391.3L554.1 391.4ZM552.6 395.5L551.1 395.2L551.1 391L552.6 391.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M551.1 395.2L549.7 394.7L549.7 390.5L551.1 391ZM549.7 394.7L548.7 394.2L548.7 389.9L549.7 390.5ZM548.7 394.2L547.9 393.5L547.9 389.2L548.7 389.9ZM547.9 393.5L547.4 392.7L547.4 388.5L547.9 389.2ZM547.4 392.7L547.3 391.9L547.3 387.7L547.4 388.5Z\"/><path class=\"iso-top\" d=\"M558.7 390.7L557.3 391.1L555.8 391.4L554.1 391.4L552.6 391.3L551.1 391L549.7 390.5L548.7 389.9L547.9 389.2L547.4 388.5L547.3 387.7L547.5 386.9L548.1 386.1L549.1 385.5L550.2 384.9L551.6 384.5L553.2 384.3L554.8 384.2L556.4 384.4L557.9 384.7L559.2 385.1L560.3 385.7L561.1 386.4L561.5 387.2L561.6 388L561.4 388.8L560.8 389.5L559.9 390.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M561.6 388L561.4 388.8L560.8 389.5L559.9 390.2L558.7 390.7L557.3 391.1L555.8 391.4L554.1 391.4L552.6 391.3L551.1 391L549.7 390.5L548.7 389.9L547.9 389.2L547.4 388.5L547.3 387.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M547.3 387.7L547.5 386.9L548.1 386.1L549.1 385.5L550.2 384.9L551.6 384.5L553.2 384.3L554.8 384.2L556.4 384.4L557.9 384.7L559.2 385.1L560.3 385.7L561.1 386.4L561.5 387.2L561.6 388M561.6 392.2L561.4 393L560.8 393.7L559.9 394.4L558.7 394.9L557.3 395.3L555.8 395.6L554.1 395.6L552.6 395.5L551.1 395.2L549.7 394.7L548.7 394.2L547.9 393.5L547.4 392.7L547.3 391.9M547.3 387.7L547.3 391.9M561.6 388L561.6 392.2\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M449.6 426.6L449.9 425.5L450.7 424.6L451.9 423.7L453.4 423L455.2 422.5L457.2 422.2L459.3 422.1L461.3 422.3L463.3 422.7L465 423.3L466.4 424L467.4 425L468 425.9L468.1 427L468.1 428.8L467.8 429.8L467 430.8L465.8 431.6L464.3 432.3L462.5 432.8L460.5 433.1L458.4 433.2L456.4 433L454.5 432.7L452.8 432.1L451.4 431.3L450.3 430.4L449.7 429.4L449.6 428.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M468.1 428.8L467.8 429.8L467.8 428L468.1 427ZM467.8 429.8L467 430.8L467 429L467.8 428ZM467 430.8L465.8 431.6L465.8 429.8L467 429ZM465.8 431.6L464.3 432.3L464.3 430.5L465.8 429.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M464.3 432.3L462.5 432.8L462.5 431L464.3 430.5ZM462.5 432.8L460.5 433.1L460.5 431.3L462.5 431ZM460.5 433.1L458.4 433.2L458.4 431.4L460.5 431.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M458.4 433.2L456.4 433L456.4 431.2L458.4 431.4ZM456.4 433L454.5 432.7L454.5 430.9L456.4 431.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M454.5 432.7L452.8 432.1L452.8 430.3L454.5 430.9ZM452.8 432.1L451.4 431.3L451.4 429.5L452.8 430.3ZM451.4 431.3L450.3 430.4L450.3 428.6L451.4 429.5ZM450.3 430.4L449.7 429.4L449.7 427.6L450.3 428.6ZM449.7 429.4L449.6 428.4L449.6 426.6L449.7 427.6Z\"/><path class=\"iso-top\" d=\"M464.3 430.5L462.5 431L460.5 431.3L458.4 431.4L456.4 431.2L454.5 430.9L452.8 430.3L451.4 429.5L450.3 428.6L449.7 427.6L449.6 426.6L449.9 425.5L450.7 424.6L451.9 423.7L453.4 423L455.2 422.5L457.2 422.2L459.3 422.1L461.3 422.3L463.3 422.7L465 423.3L466.4 424L467.4 425L468 425.9L468.1 427L467.8 428L467 429L465.8 429.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M468.1 427L467.8 428L467 429L465.8 429.8L464.3 430.5L462.5 431L460.5 431.3L458.4 431.4L456.4 431.2L454.5 430.9L452.8 430.3L451.4 429.5L450.3 428.6L449.7 427.6L449.6 426.6\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M449.6 426.6L449.9 425.5L450.7 424.6L451.9 423.7L453.4 423L455.2 422.5L457.2 422.2L459.3 422.1L461.3 422.3L463.3 422.7L465 423.3L466.4 424L467.4 425L468 425.9L468.1 427M468.1 428.8L467.8 429.8L467 430.8L465.8 431.6L464.3 432.3L462.5 432.8L460.5 433.1L458.4 433.2L456.4 433L454.5 432.7L452.8 432.1L451.4 431.3L450.3 430.4L449.7 429.4L449.6 428.4M449.6 426.6L449.6 428.4M468.1 427L468.1 428.8\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M451.7 422.4L451.9 421.6L452.5 420.9L453.5 420.2L454.6 419.7L456 419.3L457.6 419L459.2 419L460.8 419.1L462.3 419.4L463.6 419.9L464.7 420.4L465.5 421.1L465.9 421.9L466 422.7L466 426.9L465.8 427.7L465.2 428.5L464.3 429.1L463.1 429.7L461.7 430.1L460.1 430.3L458.5 430.4L457 430.2L455.5 429.9L454.1 429.5L453.1 428.9L452.3 428.2L451.8 427.4L451.7 426.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M466 426.9L465.8 427.7L465.8 423.5L466 422.7ZM465.8 427.7L465.2 428.5L465.2 424.3L465.8 423.5ZM465.2 428.5L464.3 429.1L464.3 424.9L465.2 424.3ZM464.3 429.1L463.1 429.7L463.1 425.5L464.3 424.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M463.1 429.7L461.7 430.1L461.7 425.9L463.1 425.5ZM461.7 430.1L460.1 430.3L460.1 426.1L461.7 425.9ZM460.1 430.3L458.5 430.4L458.5 426.1L460.1 426.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M458.5 430.4L457 430.2L457 426L458.5 426.1ZM457 430.2L455.5 429.9L455.5 425.7L457 426Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M455.5 429.9L454.1 429.5L454.1 425.3L455.5 425.7ZM454.1 429.5L453.1 428.9L453.1 424.7L454.1 425.3ZM453.1 428.9L452.3 428.2L452.3 424L453.1 424.7ZM452.3 428.2L451.8 427.4L451.8 423.2L452.3 424ZM451.8 427.4L451.7 426.6L451.7 422.4L451.8 423.2Z\"/><path class=\"iso-top\" d=\"M463.1 425.5L461.7 425.9L460.1 426.1L458.5 426.1L457 426L455.5 425.7L454.1 425.3L453.1 424.7L452.3 424L451.8 423.2L451.7 422.4L451.9 421.6L452.5 420.9L453.5 420.2L454.6 419.7L456 419.3L457.6 419L459.2 419L460.8 419.1L462.3 419.4L463.6 419.9L464.7 420.4L465.5 421.1L465.9 421.9L466 422.7L465.8 423.5L465.2 424.3L464.3 424.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M466 422.7L465.8 423.5L465.2 424.3L464.3 424.9L463.1 425.5L461.7 425.9L460.1 426.1L458.5 426.1L457 426L455.5 425.7L454.1 425.3L453.1 424.7L452.3 424L451.8 423.2L451.7 422.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M451.7 422.4L451.9 421.6L452.5 420.9L453.5 420.2L454.6 419.7L456 419.3L457.6 419L459.2 419L460.8 419.1L462.3 419.4L463.6 419.9L464.7 420.4L465.5 421.1L465.9 421.9L466 422.7M466 426.9L465.8 427.7L465.2 428.5L464.3 429.1L463.1 429.7L461.7 430.1L460.1 430.3L458.5 430.4L457 430.2L455.5 429.9L454.1 429.5L453.1 428.9L452.3 428.2L451.8 427.4L451.7 426.6M451.7 422.4L451.7 426.6M466 422.7L466 426.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M170.8 234.5L171 233.4L171.5 232.4L172.4 231.5L173.6 230.7L175.1 230L298.9 185.1L300.6 184.6L302.5 184.2L304.6 184.1L306.6 184.2L308.6 184.4L310.4 184.9L312.1 185.5L313.4 186.2L587.2 374.6L588.2 375.5L588.9 376.5L589.2 377.5L589.2 389.5L589 390.6L588.5 391.6L587.6 392.5L586.4 393.3L584.9 394L461.1 438.9L459.4 439.4L457.5 439.8L455.4 439.9L453.4 439.8L451.4 439.6L449.6 439.1L447.9 438.5L446.6 437.8L172.8 249.4L171.8 248.5L171.1 247.5L170.8 246.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M589.2 389.5L589 390.6L589 378.5L589.2 377.5ZM589 390.6L588.5 391.6L588.5 379.5L589 378.5ZM588.5 391.6L587.6 392.5L587.6 380.4L588.5 379.5ZM587.6 392.5L586.4 393.3L586.4 381.2L587.6 380.4ZM586.4 393.3L584.9 394L584.9 381.9L586.4 381.2ZM584.9 394L461.1 438.9L461.1 426.9L584.9 381.9ZM461.1 438.9L459.4 439.4L459.4 427.4L461.1 426.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M459.4 439.4L457.5 439.8L457.5 427.7L459.4 427.4ZM457.5 439.8L455.4 439.9L455.4 427.9L457.5 427.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M455.4 439.9L453.4 439.8L453.4 427.8L455.4 427.9ZM453.4 439.8L451.4 439.6L451.4 427.5L453.4 427.8ZM451.4 439.6L449.6 439.1L449.6 427.1L451.4 427.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M449.6 439.1L447.9 438.5L447.9 426.5L449.6 427.1ZM447.9 438.5L446.6 437.8L446.6 425.7L447.9 426.5ZM446.6 437.8L172.8 249.4L172.8 237.3L446.6 425.7ZM172.8 249.4L171.8 248.5L171.8 236.4L172.8 237.3ZM171.8 248.5L171.1 247.5L171.1 235.5L171.8 236.4ZM171.1 247.5L170.8 246.5L170.8 234.5L171.1 235.5Z\"/><path class=\"iso-top\" d=\"M587.2 374.6L588.2 375.5L588.9 376.5L589.2 377.5L589 378.5L588.5 379.5L587.6 380.4L586.4 381.2L584.9 381.9L461.1 426.9L459.4 427.4L457.5 427.7L455.4 427.9L453.4 427.8L451.4 427.5L449.6 427.1L447.9 426.5L446.6 425.7L172.8 237.3L171.8 236.4L171.1 235.5L170.8 234.5L171 233.4L171.5 232.4L172.4 231.5L173.6 230.7L175.1 230L298.9 185.1L300.6 184.6L302.5 184.2L304.6 184.1L306.6 184.2L308.6 184.4L310.4 184.9L312.1 185.5L313.4 186.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M589.2 377.5L589 378.5L588.5 379.5L587.6 380.4L586.4 381.2L584.9 381.9L461.1 426.9L459.4 427.4L457.5 427.7L455.4 427.9L453.4 427.8L451.4 427.5L449.6 427.1L447.9 426.5L446.6 425.7L172.8 237.3L171.8 236.4L171.1 235.5L170.8 234.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M589.2 377.5L587.2 378.4L586.8 379.2L586.1 379.9L585 380.6L583.7 381.2L460.1 426.1L458.6 426.5L457 426.8L455.4 426.9L453.7 426.9L452.1 426.7L450.5 426.3L449.2 425.8L448 425.1L174.4 236.8L173.5 236L172.9 235.3L170.8 234.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M170.8 234.5L171 233.4L171.5 232.4L172.4 231.5L173.6 230.7L175.1 230L298.9 185.1L300.6 184.6L302.5 184.2L304.6 184.1L306.6 184.2L308.6 184.4L310.4 184.9L312.1 185.5L313.4 186.2L587.2 374.6L588.2 375.5L588.9 376.5L589.2 377.5M589.2 389.5L589 390.6L588.5 391.6L587.6 392.5L586.4 393.3L584.9 394L461.1 438.9L459.4 439.4L457.5 439.8L455.4 439.9L453.4 439.8L451.4 439.6L449.6 439.1L447.9 438.5L446.6 437.8L172.8 249.4L171.8 248.5L171.1 247.5L170.8 246.5M589.2 377.5L589.2 389.5M170.8 234.5L170.8 246.5\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M582.5 376.3L583 376.7L583.3 377.2L583.4 377.6L583.3 378.1L583.1 378.5L582.7 378.9L582.2 379.3L581.5 379.6L457.7 424.5L457 424.8L456.1 424.9L455.2 425L454.3 424.9L453.4 424.8L452.6 424.6L451.9 424.4L451.3 424L177.5 235.6L177 235.2L176.7 234.8L176.6 234.3L176.7 233.9L176.9 233.5L177.3 233L177.8 232.7L178.5 232.4L302.3 187.4L303 187.2L303.9 187.1L304.8 187L305.7 187L306.6 187.1L307.4 187.3L308.1 187.6L308.7 187.9Z\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M306.1 192L305.1 192.3L304 192.3L303 192.1L302.2 191.7L301.8 191.2L301.7 190.7L302.1 190.2L302.8 189.8L303.8 189.6L304.9 189.6L305.9 189.7L306.7 190.1L307.2 190.6L307.2 191.1L306.8 191.7ZM577.1 378.6L576.2 378.8L575.1 378.8L574.1 378.6L573.3 378.3L572.8 377.8L572.8 377.2L573.1 376.7L573.9 376.3L574.9 376.1L575.9 376.1L577 376.3L577.8 376.6L578.2 377.1L578.3 377.7L577.9 378.2ZM186.1 235.6L185.1 235.9L184.1 235.9L183 235.7L182.2 235.3L181.8 234.8L181.7 234.3L182.1 233.8L182.9 233.4L183.8 233.2L184.9 233.1L185.9 233.3L186.7 233.7L187.2 234.2L187.2 234.7L186.9 235.2ZM457.2 422.2L456.2 422.4L455.1 422.4L454.1 422.2L453.3 421.9L452.8 421.4L452.8 420.8L453.2 420.3L453.9 419.9L454.9 419.7L456 419.7L457 419.9L457.8 420.2L458.2 420.7L458.3 421.3L457.9 421.8Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"304.5\" cy=\"190.9\" r=\"0.55\"/><circle cx=\"575.5\" cy=\"377.5\" r=\"0.55\"/><circle cx=\"184.5\" cy=\"234.5\" r=\"0.55\"/><circle cx=\"455.5\" cy=\"421\" r=\"0.55\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M223.3 262.4L223.4 262.1L223.7 261.9L228.4 260.2L229 260.1L229.6 260.1L230 260.3L453.4 414L453.6 414.3L453.6 414.9L453.5 415.2L453.2 415.5L448.5 417.2L447.9 417.3L447.3 417.2L446.8 417L223.5 263.3L223.3 263Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M453.6 414.9L453.5 415.2L453.5 414.6L453.6 414.3ZM453.5 415.2L453.2 415.5L453.2 414.9L453.5 414.6ZM453.2 415.5L448.5 417.2L448.5 416.6L453.2 414.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M448.5 417.2L447.9 417.3L447.9 416.7L448.5 416.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M447.9 417.3L447.3 417.2L447.3 416.6L447.9 416.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M447.3 417.2L446.8 417L446.8 416.4L447.3 416.6ZM446.8 417L223.5 263.3L223.5 262.7L446.8 416.4ZM223.5 263.3L223.3 263L223.3 262.4L223.5 262.7Z\"/><path class=\"iso-top\" d=\"M453.4 414L453.6 414.3L453.5 414.6L453.2 414.9L448.5 416.6L447.9 416.7L447.3 416.6L446.8 416.4L223.5 262.7L223.3 262.4L223.4 262.1L223.7 261.9L228.4 260.2L229 260.1L229.6 260.1L230 260.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M223.3 262.4L223.4 262.1L223.7 261.9L228.4 260.2L229 260.1L229.6 260.1L230 260.3L453.4 414L453.6 414.3M453.6 414.9L453.5 415.2L453.2 415.5L448.5 417.2L447.9 417.3L447.3 417.2L446.8 417L223.5 263.3L223.3 263M453.6 414.3L453.6 414.9M223.3 262.4L223.3 263\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M234.1 263.9L232.2 264.6M236.8 265.8L234.9 266.4M239.5 267.6L237.6 268.3M242.2 269.5L240.4 270.2M247.7 273.3L245.8 273.9M250.4 275.1L248.5 275.8M253.1 277L251.2 277.7M255.8 278.9L254 279.6M261.3 282.6L259.4 283.3M264 284.5L262.1 285.2M266.7 286.4L264.9 287.1M269.5 288.2L267.6 288.9M274.9 292L273 292.7M277.6 293.9L275.8 294.6M280.4 295.7L278.5 296.4M283.1 297.6L281.2 298.3M288.5 301.4L286.7 302.1M291.3 303.2L289.4 303.9M294 305.1L292.1 305.8M296.7 307L294.8 307.7M302.2 310.7L300.3 311.4M304.9 312.6L303 313.3M307.6 314.5L305.7 315.2M310.3 316.4L308.5 317M315.8 320.1L313.9 320.8M318.5 322L316.6 322.7M321.2 323.9L319.3 324.5M323.9 325.7L322.1 326.4M329.4 329.5L327.5 330.2M332.1 331.4L330.2 332M334.8 333.2L333 333.9M337.6 335.1L335.7 335.8M343 338.9L341.1 339.5M345.7 340.7L343.9 341.4M348.5 342.6L346.6 343.3M351.2 344.5L349.3 345.2M356.6 348.2L354.8 348.9M359.4 350.1L357.5 350.8M362.1 352L360.2 352.7M364.8 353.9L362.9 354.5M370.3 357.6L368.4 358.3M373 359.5L371.1 360.2M375.7 361.4L373.8 362M378.4 363.2L376.6 363.9M383.9 367L382 367.7M386.6 368.9L384.7 369.5M389.3 370.7L387.4 371.4M392 372.6L390.2 373.3M397.5 376.4L395.6 377M400.2 378.2L398.3 378.9M402.9 380.1L401.1 380.8M405.7 382L403.8 382.7M411.1 385.7L409.2 386.4M413.8 387.6L412 388.3M416.6 389.5L414.7 390.2M419.3 391.4L417.4 392M424.7 395.1L422.9 395.8M427.5 397L425.6 397.7M430.2 398.9L428.3 399.5M432.9 400.7L431 401.4M438.4 404.5L436.5 405.2M441.1 406.4L439.2 407M443.8 408.2L441.9 408.9M446.5 410.1L444.7 410.8\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M231.3 262L228 263.2M245 271.4L241.6 272.6M258.6 280.7L255.2 282M272.2 290.1L268.8 291.3M285.8 299.5L282.4 300.7M299.4 308.9L296.1 310.1M313.1 318.2L309.7 319.5M326.7 327.6L323.3 328.8M340.3 337L336.9 338.2M353.9 346.4L350.5 347.6M367.5 355.7L364.2 357M381.2 365.1L377.8 366.3M394.8 374.5L391.4 375.7M408.4 383.9L405 385.1M422 393.2L418.6 394.5M435.6 402.6L432.3 403.8M449.3 412L445.9 413.2\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"227.4\" cy=\"262\" r=\"0.45\"/><circle cx=\"449.4\" cy=\"414.8\" r=\"0.45\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M184.9 234.6L185.2 234.3L185.6 234L201.6 228.2L202.2 228.1L202.9 228.1L203.5 228.2L204 228.4L233.3 248.6L233.6 248.9L233.6 249.2L233.6 250L233.4 250.3L232.9 250.6L217 256.4L216.3 256.5L215.7 256.5L215 256.4L214.5 256.2L185.3 236L185 235.7L184.9 235.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M233.6 250L233.4 250.3L233.4 249.5L233.6 249.2ZM233.4 250.3L232.9 250.6L232.9 249.8L233.4 249.5ZM232.9 250.6L217 256.4L217 255.6L232.9 249.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M217 256.4L216.3 256.5L216.3 255.7L217 255.6ZM216.3 256.5L215.7 256.5L215.7 255.7L216.3 255.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M215.7 256.5L215 256.4L215 255.6L215.7 255.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M215 256.4L214.5 256.2L214.5 255.4L215 255.6ZM214.5 256.2L185.3 236L185.3 235.2L214.5 255.4ZM185.3 236L185 235.7L185 234.9L185.3 235.2ZM185 235.7L184.9 235.4L184.9 234.6L185 234.9Z\"/><path class=\"iso-top\" d=\"M233.3 248.6L233.6 248.9L233.6 249.2L233.4 249.5L232.9 249.8L217 255.6L216.3 255.7L215.7 255.7L215 255.6L214.5 255.4L185.3 235.2L185 234.9L184.9 234.6L185.2 234.3L185.6 234L201.6 228.2L202.2 228.1L202.9 228.1L203.5 228.2L204 228.4Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M184.9 234.6L185.2 234.3L185.6 234L201.6 228.2L202.2 228.1L202.9 228.1L203.5 228.2L204 228.4L233.3 248.6L233.6 248.9L233.6 249.2M233.6 250L233.4 250.3L232.9 250.6L217 256.4L216.3 256.5L215.7 256.5L215 256.4L214.5 256.2L185.3 236L185 235.7L184.9 235.4M233.6 249.2L233.6 250M184.9 234.6L184.9 235.4\"/></g><path class=\"iso-line\" data-tone=\"faint\" d=\"M231.7 249.1L216 254.8L186.8 234.7L202.6 229Z\"/><text class=\"iso-face-text\" data-tone=\"mid\" transform=\"matrix(0.681 0.469 -0.937 0.341 199.449 232.569)\" font-size=\"3.4\" text-anchor=\"start\">SYN-Q 100</text><path class=\"iso-line\" data-tone=\"lo\" data-free=\"\" d=\"M195.6 234L216 248\"/><path class=\"iso-line\" data-tone=\"lo\" data-free=\"\" d=\"M192.2 235.2L207.2 245.5\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"227.8\" cy=\"248.8\" r=\"0.45\"/><circle cx=\"216.6\" cy=\"252.8\" r=\"0.45\"/></g><path class=\"iso-halo\" d=\"M238 64.2L238 64L238.1 63.8L238.3 63.5L238.6 63.4L238.9 63.2L300.8 40.7L301.2 40.6L301.6 40.6L302.1 40.5L302.5 40.5L303 40.6L303.4 40.7L303.7 40.8L304 41L388.5 99.1L388.7 99.3L388.9 99.5L388.9 99.7L388.9 256.3L388.9 256.5L388.8 256.7L388.6 256.9L388.3 257.1L388 257.3L326.1 279.7L325.7 279.8L325.3 279.9L324.8 280L324.4 279.9L323.9 279.9L323.5 279.8L323.2 279.6L322.9 279.5L238.4 221.4L238.2 221.2L238 221L238 220.7Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241.9 213.8L301.9 192L385 249.2L385 256.2L325 278L241.9 220.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M385 256.2L325 278L325 271L385 249.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M325 278L241.9 220.8L241.9 213.8L325 271Z\"/><path class=\"iso-top\" d=\"M385 249.2L325 271L241.9 213.8L301.9 192Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M385 249.2L325 271L241.9 213.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M385 249.2L325.1 270.7L241.9 213.8\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M241.9 213.8L301.9 192L385 249.2M385 256.2L325 278L241.9 220.8M385 249.2L385 256.2M241.9 213.8L241.9 220.8\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M238 64L238.9 63.2L300.8 40.7L302.5 40.5L304 41L388.5 99.1L388.9 100L388.9 249.5L388 250.2L326.1 272.7L324.4 272.9L322.9 272.5L238.4 214.3L238 213.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M388.9 249.5L388 250.2L388 100.7L388.9 100ZM388 250.2L326.1 272.7L326.1 123.2L388 100.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M326.1 272.7L324.4 272.9L324.4 123.4L326.1 123.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M324.4 272.9L322.9 272.5L322.9 122.9L324.4 123.4ZM322.9 272.5L238.4 214.3L238.4 64.8L322.9 122.9ZM238.4 214.3L238 213.5L238 64L238.4 64.8Z\"/><path class=\"iso-top\" d=\"M388.5 99.1L388.9 100L388 100.7L326.1 123.2L324.4 123.4L322.9 122.9L238.4 64.8L238 64L238.9 63.2L300.8 40.7L302.5 40.5L304 41Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M388.9 100L388 100.7L326.1 123.2L324.4 123.4L322.9 122.9L238.4 64.8L238 64\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M388.9 100L387.3 100.4L325.7 122.8L324.5 123L323.5 122.6L239.3 64.6L238 64\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M388.9 116L388 116.8L326.1 139.3L324.4 139.5L322.9 139L238.4 80.9L238 80\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M238 64L238.9 63.2L300.8 40.7L302.5 40.5L304 41L388.5 99.1L388.9 100M388.9 249.5L388 250.2L326.1 272.7L324.4 272.9L322.9 272.5L238.4 214.3L238 213.5M388.9 100L388.9 249.5M238 64L238 213.5\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M241.1 205.4L320.1 259.7M241.1 192.4L320.1 246.8M241.1 179.5L320.1 233.9M241.1 166.5L320.1 220.9M241.1 153.6L320.1 208M241.1 140.7L320.1 195M241.1 127.7L320.1 182.1M241.1 114.8L320.1 169.1M241.1 101.8L320.1 156.2M241.1 88.9L320.1 143.2M241.1 75.9L320.1 130.3M241.1 205.4L241.1 75.9M249 210.8L249 81.4M256.9 216.2L256.9 86.8M264.8 221.7L264.8 92.2M272.7 227.1L272.7 97.7M280.6 232.6L280.6 103.1M288.5 238L288.5 108.6M296.4 243.4L296.4 114M304.3 248.9L304.3 119.4M312.2 254.3L312.2 124.9M320.1 259.7L320.1 130.3\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"245.1\" cy=\"197.4\" r=\"0.6\"/><circle cx=\"253\" cy=\"202.8\" r=\"0.6\"/><circle cx=\"260.9\" cy=\"208.2\" r=\"0.6\"/><circle cx=\"268.8\" cy=\"213.7\" r=\"0.6\"/><circle cx=\"276.7\" cy=\"219.1\" r=\"0.6\"/><circle cx=\"284.6\" cy=\"224.5\" r=\"0.6\"/><circle cx=\"292.5\" cy=\"230\" r=\"0.6\"/><circle cx=\"300.4\" cy=\"235.4\" r=\"0.6\"/><circle cx=\"308.3\" cy=\"240.9\" r=\"0.6\"/><circle cx=\"316.2\" cy=\"246.3\" r=\"0.6\"/><circle cx=\"245.1\" cy=\"184.4\" r=\"0.6\"/><circle cx=\"253\" cy=\"189.9\" r=\"0.6\"/><circle cx=\"260.9\" cy=\"195.3\" r=\"0.6\"/><circle cx=\"268.8\" cy=\"200.7\" r=\"0.6\"/><circle cx=\"276.7\" cy=\"206.2\" r=\"0.6\"/><circle cx=\"284.6\" cy=\"211.6\" r=\"0.6\"/><circle cx=\"292.5\" cy=\"217\" r=\"0.6\"/><circle cx=\"300.4\" cy=\"222.5\" r=\"0.6\"/><circle cx=\"308.3\" cy=\"227.9\" r=\"0.6\"/><circle cx=\"316.2\" cy=\"233.3\" r=\"0.6\"/><circle cx=\"245.1\" cy=\"171.5\" r=\"0.6\"/><circle cx=\"253\" cy=\"176.9\" r=\"0.6\"/><circle cx=\"260.9\" cy=\"182.3\" r=\"0.6\"/><circle cx=\"268.8\" cy=\"187.8\" r=\"0.6\"/><circle cx=\"276.7\" cy=\"193.2\" r=\"0.6\"/><circle cx=\"284.6\" cy=\"198.7\" r=\"0.6\"/><circle cx=\"292.5\" cy=\"204.1\" r=\"0.6\"/><circle cx=\"300.4\" cy=\"209.5\" r=\"0.6\"/><circle cx=\"308.3\" cy=\"215\" r=\"0.6\"/><circle cx=\"316.2\" cy=\"220.4\" r=\"0.6\"/><circle cx=\"245.1\" cy=\"158.5\" r=\"0.6\"/><circle cx=\"253\" cy=\"164\" r=\"0.6\"/><circle cx=\"260.9\" cy=\"169.4\" r=\"0.6\"/><circle cx=\"268.8\" cy=\"174.8\" r=\"0.6\"/><circle cx=\"276.7\" cy=\"180.3\" r=\"0.6\"/><circle cx=\"284.6\" cy=\"185.7\" r=\"0.6\"/><circle cx=\"292.5\" cy=\"191.1\" r=\"0.6\"/><circle cx=\"300.4\" cy=\"196.6\" r=\"0.6\"/><circle cx=\"308.3\" cy=\"202\" r=\"0.6\"/><circle cx=\"316.2\" cy=\"207.5\" r=\"0.6\"/><circle cx=\"245.1\" cy=\"145.6\" r=\"0.6\"/><circle cx=\"253\" cy=\"151\" r=\"0.6\"/><circle cx=\"260.9\" cy=\"156.5\" r=\"0.6\"/><circle cx=\"268.8\" cy=\"161.9\" r=\"0.6\"/><circle cx=\"276.7\" cy=\"167.3\" r=\"0.6\"/><circle cx=\"284.6\" cy=\"172.8\" r=\"0.6\"/><circle cx=\"292.5\" cy=\"178.2\" r=\"0.6\"/><circle cx=\"300.4\" cy=\"183.6\" r=\"0.6\"/><circle cx=\"308.3\" cy=\"189.1\" r=\"0.6\"/><circle cx=\"316.2\" cy=\"194.5\" r=\"0.6\"/><circle cx=\"245.1\" cy=\"132.6\" r=\"0.6\"/><circle cx=\"253\" cy=\"138.1\" r=\"0.6\"/><circle cx=\"260.9\" cy=\"143.5\" r=\"0.6\"/><circle cx=\"268.8\" cy=\"148.9\" r=\"0.6\"/><circle cx=\"276.7\" cy=\"154.4\" r=\"0.6\"/><circle cx=\"284.6\" cy=\"159.8\" r=\"0.6\"/><circle cx=\"292.5\" cy=\"165.3\" r=\"0.6\"/><circle cx=\"300.4\" cy=\"170.7\" r=\"0.6\"/><circle cx=\"308.3\" cy=\"176.1\" r=\"0.6\"/><circle cx=\"316.2\" cy=\"181.6\" r=\"0.6\"/><circle cx=\"245.1\" cy=\"119.7\" r=\"0.6\"/><circle cx=\"253\" cy=\"125.1\" r=\"0.6\"/><circle cx=\"260.9\" cy=\"130.6\" r=\"0.6\"/><circle cx=\"268.8\" cy=\"136\" r=\"0.6\"/><circle cx=\"276.7\" cy=\"141.4\" r=\"0.6\"/><circle cx=\"284.6\" cy=\"146.9\" r=\"0.6\"/><circle cx=\"292.5\" cy=\"152.3\" r=\"0.6\"/><circle cx=\"300.4\" cy=\"157.8\" r=\"0.6\"/><circle cx=\"308.3\" cy=\"163.2\" r=\"0.6\"/><circle cx=\"316.2\" cy=\"168.6\" r=\"0.6\"/><circle cx=\"245.1\" cy=\"106.8\" r=\"0.6\"/><circle cx=\"253\" cy=\"112.2\" r=\"0.6\"/><circle cx=\"260.9\" cy=\"117.6\" r=\"0.6\"/><circle cx=\"268.8\" cy=\"123.1\" r=\"0.6\"/><circle cx=\"276.7\" cy=\"128.5\" r=\"0.6\"/><circle cx=\"284.6\" cy=\"133.9\" r=\"0.6\"/><circle cx=\"292.5\" cy=\"139.4\" r=\"0.6\"/><circle cx=\"300.4\" cy=\"144.8\" r=\"0.6\"/><circle cx=\"308.3\" cy=\"150.2\" r=\"0.6\"/><circle cx=\"316.2\" cy=\"155.7\" r=\"0.6\"/><circle cx=\"245.1\" cy=\"93.8\" r=\"0.6\"/><circle cx=\"253\" cy=\"99.2\" r=\"0.6\"/><circle cx=\"260.9\" cy=\"104.7\" r=\"0.6\"/><circle cx=\"268.8\" cy=\"110.1\" r=\"0.6\"/><circle cx=\"276.7\" cy=\"115.6\" r=\"0.6\"/><circle cx=\"284.6\" cy=\"121\" r=\"0.6\"/><circle cx=\"292.5\" cy=\"126.4\" r=\"0.6\"/><circle cx=\"300.4\" cy=\"131.9\" r=\"0.6\"/><circle cx=\"308.3\" cy=\"137.3\" r=\"0.6\"/><circle cx=\"316.2\" cy=\"142.7\" r=\"0.6\"/><circle cx=\"245.1\" cy=\"80.9\" r=\"0.6\"/><circle cx=\"253\" cy=\"86.3\" r=\"0.6\"/><circle cx=\"260.9\" cy=\"91.7\" r=\"0.6\"/><circle cx=\"268.8\" cy=\"97.2\" r=\"0.6\"/><circle cx=\"276.7\" cy=\"102.6\" r=\"0.6\"/><circle cx=\"284.6\" cy=\"108\" r=\"0.6\"/><circle cx=\"292.5\" cy=\"113.5\" r=\"0.6\"/><circle cx=\"300.4\" cy=\"118.9\" r=\"0.6\"/><circle cx=\"308.3\" cy=\"124.4\" r=\"0.6\"/><circle cx=\"316.2\" cy=\"129.8\" r=\"0.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"384.2\" cy=\"243.6\" r=\"0.55\"/><circle cx=\"329.9\" cy=\"263.3\" r=\"0.55\"/><circle cx=\"384.2\" cy=\"110.1\" r=\"0.55\"/><circle cx=\"329.9\" cy=\"129.9\" r=\"0.55\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M373 166.4L341.1 178M373 164.4L341.1 176M373 166.4L373 164.4M341.1 178L341.1 176M373 160.4L341.1 171.9M373 158.4L341.1 169.9M373 160.4L373 158.4M341.1 171.9L341.1 169.9M373 154.3L341.1 165.9M373 152.3L341.1 163.9M373 154.3L373 152.3M341.1 165.9L341.1 163.9M373 148.3L341.1 159.9M373 146.3L341.1 157.9M373 148.3L373 146.3M341.1 159.9L341.1 157.9M373 142.3L341.1 153.9M373 140.3L341.1 151.9M373 142.3L373 140.3M341.1 153.9L341.1 151.9M373 136.3L341.1 147.9M373 134.3L341.1 145.9M373 136.3L373 134.3M341.1 147.9L341.1 145.9\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M235.1 59.4L235.5 58.1L237.2 57L299.1 34.6L301.6 34.1L304.3 34.3L306.4 35.1L390.8 93.2L391.8 94.5L391.8 99.5L391.4 100.9L389.7 101.9L327.8 124.4L325.3 124.9L322.6 124.6L320.5 123.8L236.1 65.7L235.1 64.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M391.8 99.5L391.4 100.9L391.4 95.8L391.8 94.5ZM391.4 100.9L389.7 101.9L389.7 96.9L391.4 95.8ZM389.7 101.9L327.8 124.4L327.8 119.4L389.7 96.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M327.8 124.4L325.3 124.9L325.3 119.8L327.8 119.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M325.3 124.9L322.6 124.6L322.6 119.6L325.3 119.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M322.6 124.6L320.5 123.8L320.5 118.8L322.6 119.6ZM320.5 123.8L236.1 65.7L236.1 60.7L320.5 118.8ZM236.1 65.7L235.1 64.4L235.1 59.4L236.1 60.7Z\"/><path class=\"iso-top\" d=\"M390.8 93.2L391.8 94.5L391.4 95.8L389.7 96.9L327.8 119.4L325.3 119.8L322.6 119.6L320.5 118.8L236.1 60.7L235.1 59.4L235.5 58.1L237.2 57L299.1 34.6L301.6 34.1L304.3 34.3L306.4 35.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M391.8 94.5L391.4 95.8L389.7 96.9L327.8 119.4L325.3 119.8L322.6 119.6L320.5 118.8L236.1 60.7L235.1 59.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M391.8 94.5L390.5 95.6L389 96.5L327.4 119L325.2 119.4L323 119.2L321.2 118.5L236.9 60.4L235.1 59.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M235.1 59.4L235.5 58.1L237.2 57L299.1 34.6L301.6 34.1L304.3 34.3L306.4 35.1L390.8 93.2L391.8 94.5M391.8 99.5L391.4 100.9L389.7 101.9L327.8 124.4L325.3 124.9L322.6 124.6L320.5 123.8L236.1 65.7L235.1 64.4M391.8 94.5L391.8 99.5M235.1 59.4L235.1 64.4\"/></g><path class=\"iso-line\" data-tone=\"faint\" d=\"M387.1 94.6L387.2 94.7L387.1 94.9L386.9 95L325.1 117.5L324.8 117.5L324.5 117.5L324.3 117.4L239.8 59.3L239.7 59.2L239.8 59L240 58.9L301.8 36.4L302.1 36.4L302.4 36.4L302.6 36.5Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"301.8\" cy=\"37.9\" r=\"0.5\"/><circle cx=\"384.2\" cy=\"94.6\" r=\"0.5\"/><circle cx=\"242.7\" cy=\"59.3\" r=\"0.5\"/><circle cx=\"325.1\" cy=\"116\" r=\"0.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M355.6 203L356.1 202.6L386.1 191.7L387 191.6L387.7 191.8L390.4 193.7L390.6 194.2L390.6 224.3L390.2 224.6L360.2 235.5L359.3 235.6L358.6 235.4L355.8 233.5L355.6 233.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M390.6 224.3L390.2 224.6L390.2 194.5L390.6 194.2ZM390.2 224.6L360.2 235.5L360.2 205.4L390.2 194.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M360.2 235.5L359.3 235.6L359.3 205.5L360.2 205.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M359.3 235.6L358.6 235.4L358.6 205.3L359.3 205.5ZM358.6 235.4L355.8 233.5L355.8 203.4L358.6 205.3ZM355.8 233.5L355.6 233.1L355.6 203L355.8 203.4Z\"/><path class=\"iso-top\" d=\"M390.4 193.7L390.6 194.2L390.2 194.5L360.2 205.4L359.3 205.5L358.6 205.3L355.8 203.4L355.6 203L356.1 202.6L386.1 191.7L387 191.6L387.7 191.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M390.6 194.2L390.2 194.5L360.2 205.4L359.3 205.5L358.6 205.3L355.8 203.4L355.6 203\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M390.6 194.2L389.8 194.3L359.9 205.2L359.4 205.2L359 205.1L356.4 203.3L355.6 203\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M355.6 203L356.1 202.6L386.1 191.7L387 191.6L387.7 191.8L390.4 193.7L390.6 194.2M390.6 224.3L390.2 224.6L360.2 235.5L359.3 235.6L358.6 235.4L355.8 233.5L355.6 233.1M390.6 194.2L390.6 224.3M355.6 203L355.6 233.1\"/></g><path class=\"bk-mouth\" d=\"M386.4 218L363.9 226.1L363.9 210.1L386.4 201.9Z\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M386.4 218L363.9 226.1L363.9 210.1L386.4 201.9Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"388.8\" cy=\"221.1\" r=\"0.45\"/><circle cx=\"361.6\" cy=\"231\" r=\"0.45\"/><circle cx=\"388.8\" cy=\"199.1\" r=\"0.45\"/><circle cx=\"361.6\" cy=\"208.9\" r=\"0.45\"/></g><g data-part=\"tags\"><g class=\"bk-tag\" data-slot=\"0\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241 195.1L241.2 195L241.8 194.8L242.1 194.8L242.3 194.8L247.9 198.7L248 198.8L248 208.3L247.8 208.5L247.2 208.7L246.9 208.7L246.7 208.7L241.1 204.8L241 204.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M248 208.3L247.8 208.5L247.8 198.9L248 198.8ZM247.8 208.5L247.2 208.7L247.2 199.2L247.8 198.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M247.2 208.7L246.9 208.7L246.9 199.2L247.2 199.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M246.9 208.7L246.7 208.7L246.7 199.1L246.9 199.2ZM246.7 208.7L241.1 204.8L241.1 195.3L246.7 199.1ZM241.1 204.8L241 204.7L241 195.1L241.1 195.3Z\"/><path class=\"iso-top\" d=\"M247.9 198.7L248 198.8L247.8 198.9L247.2 199.2L246.9 199.2L246.7 199.1L241.1 195.3L241 195.1L241.2 195L241.8 194.8L242.1 194.8L242.3 194.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241 195.1L241.2 195L241.8 194.8L242.1 194.8L242.3 194.8L247.9 198.7L248 198.8M248 208.3L247.8 208.5L247.2 208.7L246.9 208.7L246.7 208.7L241.1 204.8L241 204.7M248 198.8L248 208.3M241 195.1L241 204.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"243.9\" cy=\"197.8\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"10\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241 182.2L241.2 182.1L241.8 181.9L242.1 181.8L242.3 181.9L247.9 185.7L248 185.9L248 195.4L247.8 195.5L247.2 195.7L246.9 195.8L246.7 195.7L241.1 191.9L241 191.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M248 195.4L247.8 195.5L247.8 186L248 185.9ZM247.8 195.5L247.2 195.7L247.2 186.2L247.8 186Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M247.2 195.7L246.9 195.8L246.9 186.2L247.2 186.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M246.9 195.8L246.7 195.7L246.7 186.2L246.9 186.2ZM246.7 195.7L241.1 191.9L241.1 182.3L246.7 186.2ZM241.1 191.9L241 191.7L241 182.2L241.1 182.3Z\"/><path class=\"iso-top\" d=\"M247.9 185.7L248 185.9L247.8 186L247.2 186.2L246.9 186.2L246.7 186.2L241.1 182.3L241 182.2L241.2 182.1L241.8 181.9L242.1 181.8L242.3 181.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241 182.2L241.2 182.1L241.8 181.9L242.1 181.8L242.3 181.9L247.9 185.7L248 185.9M248 195.4L247.8 195.5L247.2 195.7L246.9 195.8L246.7 195.7L241.1 191.9L241 191.7M248 185.9L248 195.4M241 182.2L241 191.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"243.9\" cy=\"184.9\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"1\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M248.9 200.6L249.1 200.5L249.7 200.2L250 200.2L250.2 200.3L255.8 204.1L255.9 204.2L255.9 213.8L255.7 213.9L255.1 214.1L254.8 214.2L254.6 214.1L249 210.2L248.9 210.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M255.9 213.8L255.7 213.9L255.7 204.4L255.9 204.2ZM255.7 213.9L255.1 214.1L255.1 204.6L255.7 204.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M255.1 214.1L254.8 214.2L254.8 204.6L255.1 204.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M254.8 214.2L254.6 214.1L254.6 204.6L254.8 204.6ZM254.6 214.1L249 210.2L249 200.7L254.6 204.6ZM249 210.2L248.9 210.1L248.9 200.6L249 200.7Z\"/><path class=\"iso-top\" d=\"M255.8 204.1L255.9 204.2L255.7 204.4L255.1 204.6L254.8 204.6L254.6 204.6L249 200.7L248.9 200.6L249.1 200.5L249.7 200.2L250 200.2L250.2 200.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M248.9 200.6L249.1 200.5L249.7 200.2L250 200.2L250.2 200.3L255.8 204.1L255.9 204.2M255.9 213.8L255.7 213.9L255.1 214.1L254.8 214.2L254.6 214.1L249 210.2L248.9 210.1M255.9 204.2L255.9 213.8M248.9 200.6L248.9 210.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"251.8\" cy=\"203.2\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"20\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241 169.3L241.2 169.1L241.8 168.9L242.1 168.9L242.3 168.9L247.9 172.8L248 172.9L248 182.5L247.8 182.6L247.2 182.8L246.9 182.8L246.7 182.8L241.1 178.9L241 178.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M248 182.5L247.8 182.6L247.8 173L248 172.9ZM247.8 182.6L247.2 182.8L247.2 173.3L247.8 173Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M247.2 182.8L246.9 182.8L246.9 173.3L247.2 173.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M246.9 182.8L246.7 182.8L246.7 173.2L246.9 173.3ZM246.7 182.8L241.1 178.9L241.1 169.4L246.7 173.2ZM241.1 178.9L241 178.8L241 169.3L241.1 169.4Z\"/><path class=\"iso-top\" d=\"M247.9 172.8L248 172.9L247.8 173L247.2 173.3L246.9 173.3L246.7 173.2L241.1 169.4L241 169.3L241.2 169.1L241.8 168.9L242.1 168.9L242.3 168.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241 169.3L241.2 169.1L241.8 168.9L242.1 168.9L242.3 168.9L247.9 172.8L248 172.9M248 182.5L247.8 182.6L247.2 182.8L246.9 182.8L246.7 182.8L241.1 178.9L241 178.8M248 172.9L248 182.5M241 169.3L241 178.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"243.9\" cy=\"171.9\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"11\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M248.9 187.6L249.1 187.5L249.7 187.3L250 187.3L250.2 187.3L255.8 191.2L255.9 191.3L255.9 200.8L255.7 200.9L255.1 201.2L254.8 201.2L254.6 201.1L249 197.3L248.9 197.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M255.9 200.8L255.7 200.9L255.7 191.4L255.9 191.3ZM255.7 200.9L255.1 201.2L255.1 191.7L255.7 191.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M255.1 201.2L254.8 201.2L254.8 191.7L255.1 191.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M254.8 201.2L254.6 201.1L254.6 191.6L254.8 191.7ZM254.6 201.1L249 197.3L249 187.8L254.6 191.6ZM249 197.3L248.9 197.2L248.9 187.6L249 187.8Z\"/><path class=\"iso-top\" d=\"M255.8 191.2L255.9 191.3L255.7 191.4L255.1 191.7L254.8 191.7L254.6 191.6L249 187.8L248.9 187.6L249.1 187.5L249.7 187.3L250 187.3L250.2 187.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M248.9 187.6L249.1 187.5L249.7 187.3L250 187.3L250.2 187.3L255.8 191.2L255.9 191.3M255.9 200.8L255.7 200.9L255.1 201.2L254.8 201.2L254.6 201.1L249 197.3L248.9 197.2M255.9 191.3L255.9 200.8M248.9 187.6L248.9 197.2\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"251.8\" cy=\"190.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"2\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M256.8 206L257 205.9L257.6 205.7L257.9 205.6L258.1 205.7L263.7 209.6L263.8 209.7L263.8 219.2L263.6 219.3L263 219.6L262.7 219.6L262.5 219.5L256.9 215.7L256.8 215.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.8 219.2L263.6 219.3L263.6 209.8L263.8 209.7ZM263.6 219.3L263 219.6L263 210L263.6 209.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M263 219.6L262.7 219.6L262.7 210.1L263 210Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M262.7 219.6L262.5 219.5L262.5 210L262.7 210.1ZM262.5 219.5L256.9 215.7L256.9 206.1L262.5 210ZM256.9 215.7L256.8 215.6L256.8 206L256.9 206.1Z\"/><path class=\"iso-top\" d=\"M263.7 209.6L263.8 209.7L263.6 209.8L263 210L262.7 210.1L262.5 210L256.9 206.1L256.8 206L257 205.9L257.6 205.7L257.9 205.6L258.1 205.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M256.8 206L257 205.9L257.6 205.7L257.9 205.6L258.1 205.7L263.7 209.6L263.8 209.7M263.8 219.2L263.6 219.3L263 219.6L262.7 219.6L262.5 219.5L256.9 215.7L256.8 215.6M263.8 209.7L263.8 219.2M256.8 206L256.8 215.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"259.7\" cy=\"208.7\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"30\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241 156.3L241.2 156.2L241.8 156L242.1 155.9L242.3 156L247.9 159.8L248 160L248 169.5L247.8 169.6L247.2 169.9L246.9 169.9L246.7 169.8L241.1 166L241 165.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M248 169.5L247.8 169.6L247.8 160.1L248 160ZM247.8 169.6L247.2 169.9L247.2 160.3L247.8 160.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M247.2 169.9L246.9 169.9L246.9 160.4L247.2 160.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M246.9 169.9L246.7 169.8L246.7 160.3L246.9 160.4ZM246.7 169.8L241.1 166L241.1 156.4L246.7 160.3ZM241.1 166L241 165.8L241 156.3L241.1 156.4Z\"/><path class=\"iso-top\" d=\"M247.9 159.8L248 160L247.8 160.1L247.2 160.3L246.9 160.4L246.7 160.3L241.1 156.4L241 156.3L241.2 156.2L241.8 156L242.1 155.9L242.3 156Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241 156.3L241.2 156.2L241.8 156L242.1 155.9L242.3 156L247.9 159.8L248 160M248 169.5L247.8 169.6L247.2 169.9L246.9 169.9L246.7 169.8L241.1 166L241 165.8M248 160L248 169.5M241 156.3L241 165.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"243.9\" cy=\"159\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"21\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M248.9 174.7L249.1 174.6L249.7 174.3L250 174.3L250.2 174.4L255.8 178.2L255.9 178.4L255.9 187.9L255.7 188L255.1 188.2L254.8 188.3L254.6 188.2L249 184.4L248.9 184.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M255.9 187.9L255.7 188L255.7 178.5L255.9 178.4ZM255.7 188L255.1 188.2L255.1 178.7L255.7 178.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M255.1 188.2L254.8 188.3L254.8 178.7L255.1 178.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M254.8 188.3L254.6 188.2L254.6 178.7L254.8 178.7ZM254.6 188.2L249 184.4L249 174.8L254.6 178.7ZM249 184.4L248.9 184.2L248.9 174.7L249 174.8Z\"/><path class=\"iso-top\" d=\"M255.8 178.2L255.9 178.4L255.7 178.5L255.1 178.7L254.8 178.7L254.6 178.7L249 174.8L248.9 174.7L249.1 174.6L249.7 174.3L250 174.3L250.2 174.4Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M248.9 174.7L249.1 174.6L249.7 174.3L250 174.3L250.2 174.4L255.8 178.2L255.9 178.4M255.9 187.9L255.7 188L255.1 188.2L254.8 188.3L254.6 188.2L249 184.4L248.9 184.2M255.9 178.4L255.9 187.9M248.9 174.7L248.9 184.2\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"251.8\" cy=\"177.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"12\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M256.8 193.1L257 193L257.6 192.7L257.9 192.7L258.1 192.8L263.7 196.6L263.8 196.7L263.8 206.3L263.6 206.4L263 206.6L262.7 206.7L262.5 206.6L256.9 202.7L256.8 202.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.8 206.3L263.6 206.4L263.6 196.8L263.8 196.7ZM263.6 206.4L263 206.6L263 197.1L263.6 196.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M263 206.6L262.7 206.7L262.7 197.1L263 197.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M262.7 206.7L262.5 206.6L262.5 197L262.7 197.1ZM262.5 206.6L256.9 202.7L256.9 193.2L262.5 197ZM256.9 202.7L256.8 202.6L256.8 193.1L256.9 193.2Z\"/><path class=\"iso-top\" d=\"M263.7 196.6L263.8 196.7L263.6 196.8L263 197.1L262.7 197.1L262.5 197L256.9 193.2L256.8 193.1L257 193L257.6 192.7L257.9 192.7L258.1 192.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M256.8 193.1L257 193L257.6 192.7L257.9 192.7L258.1 192.8L263.7 196.6L263.8 196.7M263.8 206.3L263.6 206.4L263 206.6L262.7 206.7L262.5 206.6L256.9 202.7L256.8 202.6M263.8 196.7L263.8 206.3M256.8 193.1L256.8 202.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"259.7\" cy=\"195.7\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"3\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264.7 211.5L264.9 211.3L265.5 211.1L265.8 211.1L266 211.1L271.6 215L271.6 215.1L271.6 224.6L271.5 224.8L270.9 225L270.6 225L270.4 225L264.8 221.1L264.7 221Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.6 224.6L271.5 224.8L271.5 215.2L271.6 215.1ZM271.5 224.8L270.9 225L270.9 215.5L271.5 215.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.9 225L270.6 225L270.6 215.5L270.9 215.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M270.6 225L270.4 225L270.4 215.4L270.6 215.5ZM270.4 225L264.8 221.1L264.8 211.6L270.4 215.4ZM264.8 221.1L264.7 221L264.7 211.5L264.8 211.6Z\"/><path class=\"iso-top\" d=\"M271.6 215L271.6 215.1L271.5 215.2L270.9 215.5L270.6 215.5L270.4 215.4L264.8 211.6L264.7 211.5L264.9 211.3L265.5 211.1L265.8 211.1L266 211.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M264.7 211.5L264.9 211.3L265.5 211.1L265.8 211.1L266 211.1L271.6 215L271.6 215.1M271.6 224.6L271.5 224.8L270.9 225L270.6 225L270.4 225L264.8 221.1L264.7 221M271.6 215.1L271.6 224.6M264.7 211.5L264.7 221\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"267.6\" cy=\"214.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"40\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241 143.4L241.2 143.3L241.8 143L242.1 143L242.3 143.1L247.9 146.9L248 147L248 156.6L247.8 156.7L247.2 156.9L246.9 156.9L246.7 156.9L241.1 153L241 152.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M248 156.6L247.8 156.7L247.8 147.1L248 147ZM247.8 156.7L247.2 156.9L247.2 147.4L247.8 147.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M247.2 156.9L246.9 156.9L246.9 147.4L247.2 147.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M246.9 156.9L246.7 156.9L246.7 147.3L246.9 147.4ZM246.7 156.9L241.1 153L241.1 143.5L246.7 147.3ZM241.1 153L241 152.9L241 143.4L241.1 143.5Z\"/><path class=\"iso-top\" d=\"M247.9 146.9L248 147L247.8 147.1L247.2 147.4L246.9 147.4L246.7 147.3L241.1 143.5L241 143.4L241.2 143.3L241.8 143L242.1 143L242.3 143.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241 143.4L241.2 143.3L241.8 143L242.1 143L242.3 143.1L247.9 146.9L248 147M248 156.6L247.8 156.7L247.2 156.9L246.9 156.9L246.7 156.9L241.1 153L241 152.9M248 147L248 156.6M241 143.4L241 152.9\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"243.9\" cy=\"146\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"31\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M248.9 161.8L249.1 161.6L249.7 161.4L250 161.4L250.2 161.4L255.8 165.3L255.9 165.4L255.9 174.9L255.7 175.1L255.1 175.3L254.8 175.3L254.6 175.3L249 171.4L248.9 171.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M255.9 174.9L255.7 175.1L255.7 165.5L255.9 165.4ZM255.7 175.1L255.1 175.3L255.1 165.8L255.7 165.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M255.1 175.3L254.8 175.3L254.8 165.8L255.1 165.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M254.8 175.3L254.6 175.3L254.6 165.7L254.8 165.8ZM254.6 175.3L249 171.4L249 161.9L254.6 165.7ZM249 171.4L248.9 171.3L248.9 161.8L249 161.9Z\"/><path class=\"iso-top\" d=\"M255.8 165.3L255.9 165.4L255.7 165.5L255.1 165.8L254.8 165.8L254.6 165.7L249 161.9L248.9 161.8L249.1 161.6L249.7 161.4L250 161.4L250.2 161.4Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M248.9 161.8L249.1 161.6L249.7 161.4L250 161.4L250.2 161.4L255.8 165.3L255.9 165.4M255.9 174.9L255.7 175.1L255.1 175.3L254.8 175.3L254.6 175.3L249 171.4L248.9 171.3M255.9 165.4L255.9 174.9M248.9 161.8L248.9 171.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"251.8\" cy=\"164.4\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"22\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M256.8 180.1L257 180L257.6 179.8L257.9 179.8L258.1 179.8L263.7 183.7L263.8 183.8L263.8 193.3L263.6 193.4L263 193.7L262.7 193.7L262.5 193.6L256.9 189.8L256.8 189.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.8 193.3L263.6 193.4L263.6 183.9L263.8 183.8ZM263.6 193.4L263 193.7L263 184.1L263.6 183.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M263 193.7L262.7 193.7L262.7 184.2L263 184.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M262.7 193.7L262.5 193.6L262.5 184.1L262.7 184.2ZM262.5 193.6L256.9 189.8L256.9 180.3L262.5 184.1ZM256.9 189.8L256.8 189.7L256.8 180.1L256.9 180.3Z\"/><path class=\"iso-top\" d=\"M263.7 183.7L263.8 183.8L263.6 183.9L263 184.1L262.7 184.2L262.5 184.1L256.9 180.3L256.8 180.1L257 180L257.6 179.8L257.9 179.8L258.1 179.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M256.8 180.1L257 180L257.6 179.8L257.9 179.8L258.1 179.8L263.7 183.7L263.8 183.8M263.8 193.3L263.6 193.4L263 193.7L262.7 193.7L262.5 193.6L256.9 189.8L256.8 189.7M263.8 183.8L263.8 193.3M256.8 180.1L256.8 189.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"259.7\" cy=\"182.8\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"13\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264.7 198.5L264.9 198.4L265.5 198.2L265.8 198.1L266 198.2L271.6 202L271.6 202.2L271.6 211.7L271.5 211.8L270.9 212.1L270.6 212.1L270.4 212L264.8 208.2L264.7 208Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.6 211.7L271.5 211.8L271.5 202.3L271.6 202.2ZM271.5 211.8L270.9 212.1L270.9 202.5L271.5 202.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.9 212.1L270.6 212.1L270.6 202.6L270.9 202.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M270.6 212.1L270.4 212L270.4 202.5L270.6 202.6ZM270.4 212L264.8 208.2L264.8 198.6L270.4 202.5ZM264.8 208.2L264.7 208L264.7 198.5L264.8 198.6Z\"/><path class=\"iso-top\" d=\"M271.6 202L271.6 202.2L271.5 202.3L270.9 202.5L270.6 202.6L270.4 202.5L264.8 198.6L264.7 198.5L264.9 198.4L265.5 198.2L265.8 198.1L266 198.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M264.7 198.5L264.9 198.4L265.5 198.2L265.8 198.1L266 198.2L271.6 202L271.6 202.2M271.6 211.7L271.5 211.8L270.9 212.1L270.6 212.1L270.4 212L264.8 208.2L264.7 208M271.6 202.2L271.6 211.7M264.7 198.5L264.7 208\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"267.6\" cy=\"201.2\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"50\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241 130.4L241.2 130.3L241.8 130.1L242.1 130L242.3 130.1L247.9 134L248 134.1L248 143.6L247.8 143.7L247.2 144L246.9 144L246.7 143.9L241.1 140.1L241 140Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M248 143.6L247.8 143.7L247.8 134.2L248 134.1ZM247.8 143.7L247.2 144L247.2 134.4L247.8 134.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M247.2 144L246.9 144L246.9 134.5L247.2 134.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M246.9 144L246.7 143.9L246.7 134.4L246.9 134.5ZM246.7 143.9L241.1 140.1L241.1 130.6L246.7 134.4ZM241.1 140.1L241 140L241 130.4L241.1 130.6Z\"/><path class=\"iso-top\" d=\"M247.9 134L248 134.1L247.8 134.2L247.2 134.4L246.9 134.5L246.7 134.4L241.1 130.6L241 130.4L241.2 130.3L241.8 130.1L242.1 130L242.3 130.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241 130.4L241.2 130.3L241.8 130.1L242.1 130L242.3 130.1L247.9 134L248 134.1M248 143.6L247.8 143.7L247.2 144L246.9 144L246.7 143.9L241.1 140.1L241 140M248 134.1L248 143.6M241 130.4L241 140\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"243.9\" cy=\"133.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"4\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M272.6 216.9L272.8 216.8L273.4 216.5L273.7 216.5L273.9 216.6L279.5 220.4L279.5 220.6L279.5 230.1L279.4 230.2L278.8 230.4L278.5 230.5L278.3 230.4L272.7 226.6L272.6 226.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.5 230.1L279.4 230.2L279.4 220.7L279.5 220.6ZM279.4 230.2L278.8 230.4L278.8 220.9L279.4 220.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M278.8 230.4L278.5 230.5L278.5 220.9L278.8 220.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 230.5L278.3 230.4L278.3 220.9L278.5 220.9ZM278.3 230.4L272.7 226.6L272.7 217L278.3 220.9ZM272.7 226.6L272.6 226.4L272.6 216.9L272.7 217Z\"/><path class=\"iso-top\" d=\"M279.5 220.4L279.5 220.6L279.4 220.7L278.8 220.9L278.5 220.9L278.3 220.9L272.7 217L272.6 216.9L272.8 216.8L273.4 216.5L273.7 216.5L273.9 216.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M272.6 216.9L272.8 216.8L273.4 216.5L273.7 216.5L273.9 216.6L279.5 220.4L279.5 220.6M279.5 230.1L279.4 230.2L278.8 230.4L278.5 230.5L278.3 230.4L272.7 226.6L272.6 226.4M279.5 220.6L279.5 230.1M272.6 216.9L272.6 226.4\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"275.5\" cy=\"219.5\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"41\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M248.9 148.8L249.1 148.7L249.7 148.5L250 148.4L250.2 148.5L255.8 152.3L255.9 152.5L255.9 162L255.7 162.1L255.1 162.4L254.8 162.4L254.6 162.3L249 158.5L248.9 158.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M255.9 162L255.7 162.1L255.7 152.6L255.9 152.5ZM255.7 162.1L255.1 162.4L255.1 152.8L255.7 152.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M255.1 162.4L254.8 162.4L254.8 152.9L255.1 152.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M254.8 162.4L254.6 162.3L254.6 152.8L254.8 152.9ZM254.6 162.3L249 158.5L249 148.9L254.6 152.8ZM249 158.5L248.9 158.3L248.9 148.8L249 148.9Z\"/><path class=\"iso-top\" d=\"M255.8 152.3L255.9 152.5L255.7 152.6L255.1 152.8L254.8 152.9L254.6 152.8L249 148.9L248.9 148.8L249.1 148.7L249.7 148.5L250 148.4L250.2 148.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M248.9 148.8L249.1 148.7L249.7 148.5L250 148.4L250.2 148.5L255.8 152.3L255.9 152.5M255.9 162L255.7 162.1L255.1 162.4L254.8 162.4L254.6 162.3L249 158.5L248.9 158.3M255.9 152.5L255.9 162M248.9 148.8L248.9 158.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"251.8\" cy=\"151.5\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"32\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M256.8 167.2L257 167.1L257.6 166.8L257.9 166.8L258.1 166.9L263.7 170.7L263.8 170.8L263.8 180.4L263.6 180.5L263 180.7L262.7 180.8L262.5 180.7L256.9 176.9L256.8 176.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.8 180.4L263.6 180.5L263.6 171L263.8 170.8ZM263.6 180.5L263 180.7L263 171.2L263.6 171Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M263 180.7L262.7 180.8L262.7 171.2L263 171.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M262.7 180.8L262.5 180.7L262.5 171.2L262.7 171.2ZM262.5 180.7L256.9 176.9L256.9 167.3L262.5 171.2ZM256.9 176.9L256.8 176.7L256.8 167.2L256.9 167.3Z\"/><path class=\"iso-top\" d=\"M263.7 170.7L263.8 170.8L263.6 171L263 171.2L262.7 171.2L262.5 171.2L256.9 167.3L256.8 167.2L257 167.1L257.6 166.8L257.9 166.8L258.1 166.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M256.8 167.2L257 167.1L257.6 166.8L257.9 166.8L258.1 166.9L263.7 170.7L263.8 170.8M263.8 180.4L263.6 180.5L263 180.7L262.7 180.8L262.5 180.7L256.9 176.9L256.8 176.7M263.8 170.8L263.8 180.4M256.8 167.2L256.8 176.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"259.7\" cy=\"169.8\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"23\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264.7 185.6L264.9 185.5L265.5 185.2L265.8 185.2L266 185.3L271.6 189.1L271.6 189.2L271.6 198.8L271.5 198.9L270.9 199.1L270.6 199.1L270.4 199.1L264.8 195.2L264.7 195.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.6 198.8L271.5 198.9L271.5 189.3L271.6 189.2ZM271.5 198.9L270.9 199.1L270.9 189.6L271.5 189.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.9 199.1L270.6 199.1L270.6 189.6L270.9 189.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M270.6 199.1L270.4 199.1L270.4 189.5L270.6 189.6ZM270.4 199.1L264.8 195.2L264.8 185.7L270.4 189.5ZM264.8 195.2L264.7 195.1L264.7 185.6L264.8 185.7Z\"/><path class=\"iso-top\" d=\"M271.6 189.1L271.6 189.2L271.5 189.3L270.9 189.6L270.6 189.6L270.4 189.5L264.8 185.7L264.7 185.6L264.9 185.5L265.5 185.2L265.8 185.2L266 185.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M264.7 185.6L264.9 185.5L265.5 185.2L265.8 185.2L266 185.3L271.6 189.1L271.6 189.2M271.6 198.8L271.5 198.9L270.9 199.1L270.6 199.1L270.4 199.1L264.8 195.2L264.7 195.1M271.6 189.2L271.6 198.8M264.7 185.6L264.7 195.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"267.6\" cy=\"188.2\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"60\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241 117.5L241.2 117.4L241.8 117.1L242.1 117.1L242.3 117.2L247.9 121L248 121.1L248 130.7L247.8 130.8L247.2 131L246.9 131.1L246.7 131L241.1 127.1L241 127Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M248 130.7L247.8 130.8L247.8 121.3L248 121.1ZM247.8 130.8L247.2 131L247.2 121.5L247.8 121.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M247.2 131L246.9 131.1L246.9 121.5L247.2 121.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M246.9 131.1L246.7 131L246.7 121.5L246.9 121.5ZM246.7 131L241.1 127.1L241.1 117.6L246.7 121.5ZM241.1 127.1L241 127L241 117.5L241.1 117.6Z\"/><path class=\"iso-top\" d=\"M247.9 121L248 121.1L247.8 121.3L247.2 121.5L246.9 121.5L246.7 121.5L241.1 117.6L241 117.5L241.2 117.4L241.8 117.1L242.1 117.1L242.3 117.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241 117.5L241.2 117.4L241.8 117.1L242.1 117.1L242.3 117.2L247.9 121L248 121.1M248 130.7L247.8 130.8L247.2 131L246.9 131.1L246.7 131L241.1 127.1L241 127M248 121.1L248 130.7M241 117.5L241 127\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"243.9\" cy=\"120.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"14\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M272.6 204L272.8 203.8L273.4 203.6L273.7 203.6L273.9 203.6L279.5 207.5L279.5 207.6L279.5 217.1L279.4 217.3L278.8 217.5L278.5 217.5L278.3 217.5L272.7 213.6L272.6 213.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.5 217.1L279.4 217.3L279.4 207.7L279.5 207.6ZM279.4 217.3L278.8 217.5L278.8 208L279.4 207.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M278.8 217.5L278.5 217.5L278.5 208L278.8 208Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 217.5L278.3 217.5L278.3 207.9L278.5 208ZM278.3 217.5L272.7 213.6L272.7 204.1L278.3 207.9ZM272.7 213.6L272.6 213.5L272.6 204L272.7 204.1Z\"/><path class=\"iso-top\" d=\"M279.5 207.5L279.5 207.6L279.4 207.7L278.8 208L278.5 208L278.3 207.9L272.7 204.1L272.6 204L272.8 203.8L273.4 203.6L273.7 203.6L273.9 203.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M272.6 204L272.8 203.8L273.4 203.6L273.7 203.6L273.9 203.6L279.5 207.5L279.5 207.6M279.5 217.1L279.4 217.3L278.8 217.5L278.5 217.5L278.3 217.5L272.7 213.6L272.6 213.5M279.5 207.6L279.5 217.1M272.6 204L272.6 213.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"275.5\" cy=\"206.6\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"51\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M248.9 135.9L249.1 135.8L249.7 135.5L250 135.5L250.2 135.6L255.8 139.4L255.9 139.5L255.9 149.1L255.7 149.2L255.1 149.4L254.8 149.4L254.6 149.4L249 145.5L248.9 145.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M255.9 149.1L255.7 149.2L255.7 139.6L255.9 139.5ZM255.7 149.2L255.1 149.4L255.1 139.9L255.7 139.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M255.1 149.4L254.8 149.4L254.8 139.9L255.1 139.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M254.8 149.4L254.6 149.4L254.6 139.8L254.8 139.9ZM254.6 149.4L249 145.5L249 136L254.6 139.8ZM249 145.5L248.9 145.4L248.9 135.9L249 136Z\"/><path class=\"iso-top\" d=\"M255.8 139.4L255.9 139.5L255.7 139.6L255.1 139.9L254.8 139.9L254.6 139.8L249 136L248.9 135.9L249.1 135.8L249.7 135.5L250 135.5L250.2 135.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M248.9 135.9L249.1 135.8L249.7 135.5L250 135.5L250.2 135.6L255.8 139.4L255.9 139.5M255.9 149.1L255.7 149.2L255.1 149.4L254.8 149.4L254.6 149.4L249 145.5L248.9 145.4M255.9 139.5L255.9 149.1M248.9 135.9L248.9 145.4\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"251.8\" cy=\"138.5\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"5\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.5 222.3L280.7 222.2L281.3 222L281.6 221.9L281.8 222L287.4 225.9L287.4 226L287.4 235.5L287.3 235.6L286.7 235.9L286.4 235.9L286.2 235.8L280.6 232L280.5 231.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.4 235.5L287.3 235.6L287.3 226.1L287.4 226ZM287.3 235.6L286.7 235.9L286.7 226.3L287.3 226.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.7 235.9L286.4 235.9L286.4 226.4L286.7 226.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286.4 235.9L286.2 235.8L286.2 226.3L286.4 226.4ZM286.2 235.8L280.6 232L280.6 222.5L286.2 226.3ZM280.6 232L280.5 231.9L280.5 222.3L280.6 222.5Z\"/><path class=\"iso-top\" d=\"M287.4 225.9L287.4 226L287.3 226.1L286.7 226.3L286.4 226.4L286.2 226.3L280.6 222.5L280.5 222.3L280.7 222.2L281.3 222L281.6 221.9L281.8 222Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M280.5 222.3L280.7 222.2L281.3 222L281.6 221.9L281.8 222L287.4 225.9L287.4 226M287.4 235.5L287.3 235.6L286.7 235.9L286.4 235.9L286.2 235.8L280.6 232L280.5 231.9M287.4 226L287.4 235.5M280.5 222.3L280.5 231.9\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"283.4\" cy=\"225\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"42\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M256.8 154.2L257 154.1L257.6 153.9L257.9 153.9L258.1 153.9L263.7 157.8L263.8 157.9L263.8 167.4L263.6 167.6L263 167.8L262.7 167.8L262.5 167.8L256.9 163.9L256.8 163.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.8 167.4L263.6 167.6L263.6 158L263.8 157.9ZM263.6 167.6L263 167.8L263 158.3L263.6 158Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M263 167.8L262.7 167.8L262.7 158.3L263 158.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M262.7 167.8L262.5 167.8L262.5 158.2L262.7 158.3ZM262.5 167.8L256.9 163.9L256.9 154.4L262.5 158.2ZM256.9 163.9L256.8 163.8L256.8 154.2L256.9 154.4Z\"/><path class=\"iso-top\" d=\"M263.7 157.8L263.8 157.9L263.6 158L263 158.3L262.7 158.3L262.5 158.2L256.9 154.4L256.8 154.2L257 154.1L257.6 153.9L257.9 153.9L258.1 153.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M256.8 154.2L257 154.1L257.6 153.9L257.9 153.9L258.1 153.9L263.7 157.8L263.8 157.9M263.8 167.4L263.6 167.6L263 167.8L262.7 167.8L262.5 167.8L256.9 163.9L256.8 163.8M263.8 157.9L263.8 167.4M256.8 154.2L256.8 163.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"259.7\" cy=\"156.9\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"33\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264.7 172.6L264.9 172.5L265.5 172.3L265.8 172.2L266 172.3L271.6 176.2L271.6 176.3L271.6 185.8L271.5 185.9L270.9 186.2L270.6 186.2L270.4 186.1L264.8 182.3L264.7 182.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.6 185.8L271.5 185.9L271.5 176.4L271.6 176.3ZM271.5 185.9L270.9 186.2L270.9 176.6L271.5 176.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.9 186.2L270.6 186.2L270.6 176.7L270.9 176.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M270.6 186.2L270.4 186.1L270.4 176.6L270.6 176.7ZM270.4 186.1L264.8 182.3L264.8 172.8L270.4 176.6ZM264.8 182.3L264.7 182.2L264.7 172.6L264.8 172.8Z\"/><path class=\"iso-top\" d=\"M271.6 176.2L271.6 176.3L271.5 176.4L270.9 176.6L270.6 176.7L270.4 176.6L264.8 172.8L264.7 172.6L264.9 172.5L265.5 172.3L265.8 172.2L266 172.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M264.7 172.6L264.9 172.5L265.5 172.3L265.8 172.2L266 172.3L271.6 176.2L271.6 176.3M271.6 185.8L271.5 185.9L270.9 186.2L270.6 186.2L270.4 186.1L264.8 182.3L264.7 182.2M271.6 176.3L271.6 185.8M264.7 172.6L264.7 182.2\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"267.6\" cy=\"175.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"70\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241 104.5L241.2 104.4L241.8 104.2L242.1 104.2L242.3 104.2L247.9 108.1L248 108.2L248 117.7L247.8 117.8L247.2 118.1L246.9 118.1L246.7 118L241.1 114.2L241 114.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M248 117.7L247.8 117.8L247.8 108.3L248 108.2ZM247.8 117.8L247.2 118.1L247.2 108.6L247.8 108.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M247.2 118.1L246.9 118.1L246.9 108.6L247.2 108.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M246.9 118.1L246.7 118L246.7 108.5L246.9 108.6ZM246.7 118L241.1 114.2L241.1 104.7L246.7 108.5ZM241.1 114.2L241 114.1L241 104.5L241.1 104.7Z\"/><path class=\"iso-top\" d=\"M247.9 108.1L248 108.2L247.8 108.3L247.2 108.6L246.9 108.6L246.7 108.5L241.1 104.7L241 104.5L241.2 104.4L241.8 104.2L242.1 104.2L242.3 104.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241 104.5L241.2 104.4L241.8 104.2L242.1 104.2L242.3 104.2L247.9 108.1L248 108.2M248 117.7L247.8 117.8L247.2 118.1L246.9 118.1L246.7 118L241.1 114.2L241 114.1M248 108.2L248 117.7M241 104.5L241 114.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"243.9\" cy=\"107.2\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"24\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M272.6 191L272.8 190.9L273.4 190.7L273.7 190.6L273.9 190.7L279.5 194.5L279.5 194.7L279.5 204.2L279.4 204.3L278.8 204.5L278.5 204.6L278.3 204.5L272.7 200.7L272.6 200.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.5 204.2L279.4 204.3L279.4 194.8L279.5 194.7ZM279.4 204.3L278.8 204.5L278.8 195L279.4 194.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M278.8 204.5L278.5 204.6L278.5 195L278.8 195Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 204.6L278.3 204.5L278.3 195L278.5 195ZM278.3 204.5L272.7 200.7L272.7 191.1L278.3 195ZM272.7 200.7L272.6 200.5L272.6 191L272.7 191.1Z\"/><path class=\"iso-top\" d=\"M279.5 194.5L279.5 194.7L279.4 194.8L278.8 195L278.5 195L278.3 195L272.7 191.1L272.6 191L272.8 190.9L273.4 190.7L273.7 190.6L273.9 190.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M272.6 191L272.8 190.9L273.4 190.7L273.7 190.6L273.9 190.7L279.5 194.5L279.5 194.7M279.5 204.2L279.4 204.3L278.8 204.5L278.5 204.6L278.3 204.5L272.7 200.7L272.6 200.5M279.5 194.7L279.5 204.2M272.6 191L272.6 200.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"275.5\" cy=\"193.7\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"61\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M248.9 122.9L249.1 122.8L249.7 122.6L250 122.5L250.2 122.6L255.8 126.5L255.9 126.6L255.9 136.1L255.7 136.2L255.1 136.5L254.8 136.5L254.6 136.4L249 132.6L248.9 132.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M255.9 136.1L255.7 136.2L255.7 126.7L255.9 126.6ZM255.7 136.2L255.1 136.5L255.1 126.9L255.7 126.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M255.1 136.5L254.8 136.5L254.8 127L255.1 126.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M254.8 136.5L254.6 136.4L254.6 126.9L254.8 127ZM254.6 136.4L249 132.6L249 123.1L254.6 126.9ZM249 132.6L248.9 132.5L248.9 122.9L249 123.1Z\"/><path class=\"iso-top\" d=\"M255.8 126.5L255.9 126.6L255.7 126.7L255.1 126.9L254.8 127L254.6 126.9L249 123.1L248.9 122.9L249.1 122.8L249.7 122.6L250 122.5L250.2 122.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M248.9 122.9L249.1 122.8L249.7 122.6L250 122.5L250.2 122.6L255.8 126.5L255.9 126.6M255.9 136.1L255.7 136.2L255.1 136.5L254.8 136.5L254.6 136.4L249 132.6L248.9 132.5M255.9 126.6L255.9 136.1M248.9 122.9L248.9 132.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"251.8\" cy=\"125.6\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"15\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.5 209.4L280.7 209.3L281.3 209L281.6 209L281.8 209.1L287.4 212.9L287.4 213L287.4 222.6L287.3 222.7L286.7 222.9L286.4 223L286.2 222.9L280.6 219L280.5 218.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.4 222.6L287.3 222.7L287.3 213.2L287.4 213ZM287.3 222.7L286.7 222.9L286.7 213.4L287.3 213.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.7 222.9L286.4 223L286.4 213.4L286.7 213.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286.4 223L286.2 222.9L286.2 213.4L286.4 213.4ZM286.2 222.9L280.6 219L280.6 209.5L286.2 213.4ZM280.6 219L280.5 218.9L280.5 209.4L280.6 209.5Z\"/><path class=\"iso-top\" d=\"M287.4 212.9L287.4 213L287.3 213.2L286.7 213.4L286.4 213.4L286.2 213.4L280.6 209.5L280.5 209.4L280.7 209.3L281.3 209L281.6 209L281.8 209.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M280.5 209.4L280.7 209.3L281.3 209L281.6 209L281.8 209.1L287.4 212.9L287.4 213M287.4 222.6L287.3 222.7L286.7 222.9L286.4 223L286.2 222.9L280.6 219L280.5 218.9M287.4 213L287.4 222.6M280.5 209.4L280.5 218.9\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"283.4\" cy=\"212\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"52\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M256.8 141.3L257 141.2L257.6 141L257.9 140.9L258.1 141L263.7 144.8L263.8 145L263.8 154.5L263.6 154.6L263 154.8L262.7 154.9L262.5 154.8L256.9 151L256.8 150.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.8 154.5L263.6 154.6L263.6 145.1L263.8 145ZM263.6 154.6L263 154.8L263 145.3L263.6 145.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M263 154.8L262.7 154.9L262.7 145.3L263 145.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M262.7 154.9L262.5 154.8L262.5 145.3L262.7 145.3ZM262.5 154.8L256.9 151L256.9 141.4L262.5 145.3ZM256.9 151L256.8 150.8L256.8 141.3L256.9 141.4Z\"/><path class=\"iso-top\" d=\"M263.7 144.8L263.8 145L263.6 145.1L263 145.3L262.7 145.3L262.5 145.3L256.9 141.4L256.8 141.3L257 141.2L257.6 141L257.9 140.9L258.1 141Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M256.8 141.3L257 141.2L257.6 141L257.9 140.9L258.1 141L263.7 144.8L263.8 145M263.8 154.5L263.6 154.6L263 154.8L262.7 154.9L262.5 154.8L256.9 151L256.8 150.8M263.8 145L263.8 154.5M256.8 141.3L256.8 150.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"259.7\" cy=\"144\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"6\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M288.4 227.8L288.6 227.7L289.2 227.4L289.5 227.4L289.7 227.5L295.3 231.3L295.3 231.4L295.3 241L295.2 241.1L294.6 241.3L294.3 241.3L294.1 241.3L288.5 237.4L288.4 237.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M295.3 241L295.2 241.1L295.2 231.5L295.3 231.4ZM295.2 241.1L294.6 241.3L294.6 231.8L295.2 231.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M294.6 241.3L294.3 241.3L294.3 231.8L294.6 231.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 241.3L294.1 241.3L294.1 231.7L294.3 231.8ZM294.1 241.3L288.5 237.4L288.5 227.9L294.1 231.7ZM288.5 237.4L288.4 237.3L288.4 227.8L288.5 227.9Z\"/><path class=\"iso-top\" d=\"M295.3 231.3L295.3 231.4L295.2 231.5L294.6 231.8L294.3 231.8L294.1 231.7L288.5 227.9L288.4 227.8L288.6 227.7L289.2 227.4L289.5 227.4L289.7 227.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M288.4 227.8L288.6 227.7L289.2 227.4L289.5 227.4L289.7 227.5L295.3 231.3L295.3 231.4M295.3 241L295.2 241.1L294.6 241.3L294.3 241.3L294.1 241.3L288.5 237.4L288.4 237.3M295.3 231.4L295.3 241M288.4 227.8L288.4 237.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"291.3\" cy=\"230.4\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"43\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264.7 159.7L264.9 159.6L265.5 159.3L265.8 159.3L266 159.4L271.6 163.2L271.6 163.3L271.6 172.9L271.5 173L270.9 173.2L270.6 173.3L270.4 173.2L264.8 169.3L264.7 169.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.6 172.9L271.5 173L271.5 163.5L271.6 163.3ZM271.5 173L270.9 173.2L270.9 163.7L271.5 163.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.9 173.2L270.6 173.3L270.6 163.7L270.9 163.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M270.6 173.3L270.4 173.2L270.4 163.7L270.6 163.7ZM270.4 173.2L264.8 169.3L264.8 159.8L270.4 163.7ZM264.8 169.3L264.7 169.2L264.7 159.7L264.8 159.8Z\"/><path class=\"iso-top\" d=\"M271.6 163.2L271.6 163.3L271.5 163.5L270.9 163.7L270.6 163.7L270.4 163.7L264.8 159.8L264.7 159.7L264.9 159.6L265.5 159.3L265.8 159.3L266 159.4Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M264.7 159.7L264.9 159.6L265.5 159.3L265.8 159.3L266 159.4L271.6 163.2L271.6 163.3M271.6 172.9L271.5 173L270.9 173.2L270.6 173.3L270.4 173.2L264.8 169.3L264.7 169.2M271.6 163.3L271.6 172.9M264.7 159.7L264.7 169.2\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"267.6\" cy=\"162.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"80\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241 91.6L241.2 91.5L241.8 91.2L242.1 91.2L242.3 91.3L247.9 95.1L248 95.3L248 104.8L247.8 104.9L247.2 105.1L246.9 105.2L246.7 105.1L241.1 101.3L241 101.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M248 104.8L247.8 104.9L247.8 95.4L248 95.3ZM247.8 104.9L247.2 105.1L247.2 95.6L247.8 95.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M247.2 105.1L246.9 105.2L246.9 95.6L247.2 95.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M246.9 105.2L246.7 105.1L246.7 95.6L246.9 95.6ZM246.7 105.1L241.1 101.3L241.1 91.7L246.7 95.6ZM241.1 101.3L241 101.1L241 91.6L241.1 91.7Z\"/><path class=\"iso-top\" d=\"M247.9 95.1L248 95.3L247.8 95.4L247.2 95.6L246.9 95.6L246.7 95.6L241.1 91.7L241 91.6L241.2 91.5L241.8 91.2L242.1 91.2L242.3 91.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241 91.6L241.2 91.5L241.8 91.2L242.1 91.2L242.3 91.3L247.9 95.1L248 95.3M248 104.8L247.8 104.9L247.2 105.1L246.9 105.2L246.7 105.1L241.1 101.3L241 101.1M248 95.3L248 104.8M241 91.6L241 101.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"243.9\" cy=\"94.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"34\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M272.6 178.1L272.8 177.9L273.4 177.7L273.7 177.7L273.9 177.7L279.5 181.6L279.5 181.7L279.5 191.3L279.4 191.4L278.8 191.6L278.5 191.6L278.3 191.6L272.7 187.7L272.6 187.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.5 191.3L279.4 191.4L279.4 181.8L279.5 181.7ZM279.4 191.4L278.8 191.6L278.8 182.1L279.4 181.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M278.8 191.6L278.5 191.6L278.5 182.1L278.8 182.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 191.6L278.3 191.6L278.3 182L278.5 182.1ZM278.3 191.6L272.7 187.7L272.7 178.2L278.3 182ZM272.7 187.7L272.6 187.6L272.6 178.1L272.7 178.2Z\"/><path class=\"iso-top\" d=\"M279.5 181.6L279.5 181.7L279.4 181.8L278.8 182.1L278.5 182.1L278.3 182L272.7 178.2L272.6 178.1L272.8 177.9L273.4 177.7L273.7 177.7L273.9 177.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M272.6 178.1L272.8 177.9L273.4 177.7L273.7 177.7L273.9 177.7L279.5 181.6L279.5 181.7M279.5 191.3L279.4 191.4L278.8 191.6L278.5 191.6L278.3 191.6L272.7 187.7L272.6 187.6M279.5 181.7L279.5 191.3M272.6 178.1L272.6 187.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"275.5\" cy=\"180.7\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"71\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M248.9 110L249.1 109.9L249.7 109.6L250 109.6L250.2 109.7L255.8 113.5L255.9 113.6L255.9 123.2L255.7 123.3L255.1 123.5L254.8 123.6L254.6 123.5L249 119.6L248.9 119.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M255.9 123.2L255.7 123.3L255.7 113.8L255.9 113.6ZM255.7 123.3L255.1 123.5L255.1 114L255.7 113.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M255.1 123.5L254.8 123.6L254.8 114L255.1 114Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M254.8 123.6L254.6 123.5L254.6 114L254.8 114ZM254.6 123.5L249 119.6L249 110.1L254.6 114ZM249 119.6L248.9 119.5L248.9 110L249 110.1Z\"/><path class=\"iso-top\" d=\"M255.8 113.5L255.9 113.6L255.7 113.8L255.1 114L254.8 114L254.6 114L249 110.1L248.9 110L249.1 109.9L249.7 109.6L250 109.6L250.2 109.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M248.9 110L249.1 109.9L249.7 109.6L250 109.6L250.2 109.7L255.8 113.5L255.9 113.6M255.9 123.2L255.7 123.3L255.1 123.5L254.8 123.6L254.6 123.5L249 119.6L248.9 119.5M255.9 113.6L255.9 123.2M248.9 110L248.9 119.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"251.8\" cy=\"112.6\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"25\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.5 196.4L280.7 196.3L281.3 196.1L281.6 196.1L281.8 196.1L287.4 200L287.4 200.1L287.4 209.6L287.3 209.7L286.7 210L286.4 210L286.2 209.9L280.6 206.1L280.5 206Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.4 209.6L287.3 209.7L287.3 200.2L287.4 200.1ZM287.3 209.7L286.7 210L286.7 200.5L287.3 200.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.7 210L286.4 210L286.4 200.5L286.7 200.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286.4 210L286.2 209.9L286.2 200.4L286.4 200.5ZM286.2 209.9L280.6 206.1L280.6 196.6L286.2 200.4ZM280.6 206.1L280.5 206L280.5 196.4L280.6 196.6Z\"/><path class=\"iso-top\" d=\"M287.4 200L287.4 200.1L287.3 200.2L286.7 200.5L286.4 200.5L286.2 200.4L280.6 196.6L280.5 196.4L280.7 196.3L281.3 196.1L281.6 196.1L281.8 196.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M280.5 196.4L280.7 196.3L281.3 196.1L281.6 196.1L281.8 196.1L287.4 200L287.4 200.1M287.4 209.6L287.3 209.7L286.7 210L286.4 210L286.2 209.9L280.6 206.1L280.5 206M287.4 200.1L287.4 209.6M280.5 196.4L280.5 206\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"283.4\" cy=\"199.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"62\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M256.8 128.4L257 128.2L257.6 128L257.9 128L258.1 128L263.7 131.9L263.8 132L263.8 141.6L263.6 141.7L263 141.9L262.7 141.9L262.5 141.9L256.9 138L256.8 137.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.8 141.6L263.6 141.7L263.6 132.1L263.8 132ZM263.6 141.7L263 141.9L263 132.4L263.6 132.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M263 141.9L262.7 141.9L262.7 132.4L263 132.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M262.7 141.9L262.5 141.9L262.5 132.3L262.7 132.4ZM262.5 141.9L256.9 138L256.9 128.5L262.5 132.3ZM256.9 138L256.8 137.9L256.8 128.4L256.9 128.5Z\"/><path class=\"iso-top\" d=\"M263.7 131.9L263.8 132L263.6 132.1L263 132.4L262.7 132.4L262.5 132.3L256.9 128.5L256.8 128.4L257 128.2L257.6 128L257.9 128L258.1 128Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M256.8 128.4L257 128.2L257.6 128L257.9 128L258.1 128L263.7 131.9L263.8 132M263.8 141.6L263.6 141.7L263 141.9L262.7 141.9L262.5 141.9L256.9 138L256.8 137.9M263.8 132L263.8 141.6M256.8 128.4L256.8 137.9\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"259.7\" cy=\"131\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"16\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M288.4 214.8L288.6 214.7L289.2 214.5L289.5 214.4L289.7 214.5L295.3 218.4L295.3 218.5L295.3 228L295.2 228.1L294.6 228.4L294.3 228.4L294.1 228.3L288.5 224.5L288.4 224.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M295.3 228L295.2 228.1L295.2 218.6L295.3 218.5ZM295.2 228.1L294.6 228.4L294.6 218.8L295.2 218.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M294.6 228.4L294.3 228.4L294.3 218.9L294.6 218.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 228.4L294.1 228.3L294.1 218.8L294.3 218.9ZM294.1 228.3L288.5 224.5L288.5 215L294.1 218.8ZM288.5 224.5L288.4 224.4L288.4 214.8L288.5 215Z\"/><path class=\"iso-top\" d=\"M295.3 218.4L295.3 218.5L295.2 218.6L294.6 218.8L294.3 218.9L294.1 218.8L288.5 215L288.4 214.8L288.6 214.7L289.2 214.5L289.5 214.4L289.7 214.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M288.4 214.8L288.6 214.7L289.2 214.5L289.5 214.4L289.7 214.5L295.3 218.4L295.3 218.5M295.3 228L295.2 228.1L294.6 228.4L294.3 228.4L294.1 228.3L288.5 224.5L288.4 224.4M295.3 218.5L295.3 228M288.4 214.8L288.4 224.4\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"291.3\" cy=\"217.5\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"53\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264.7 146.7L264.9 146.6L265.5 146.4L265.8 146.4L266 146.4L271.6 150.3L271.6 150.4L271.6 159.9L271.5 160L270.9 160.3L270.6 160.3L270.4 160.2L264.8 156.4L264.7 156.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.6 159.9L271.5 160L271.5 150.5L271.6 150.4ZM271.5 160L270.9 160.3L270.9 150.7L271.5 150.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.9 160.3L270.6 160.3L270.6 150.8L270.9 150.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M270.6 160.3L270.4 160.2L270.4 150.7L270.6 150.8ZM270.4 160.2L264.8 156.4L264.8 146.9L270.4 150.7ZM264.8 156.4L264.7 156.3L264.7 146.7L264.8 146.9Z\"/><path class=\"iso-top\" d=\"M271.6 150.3L271.6 150.4L271.5 150.5L270.9 150.7L270.6 150.8L270.4 150.7L264.8 146.9L264.7 146.7L264.9 146.6L265.5 146.4L265.8 146.4L266 146.4Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M264.7 146.7L264.9 146.6L265.5 146.4L265.8 146.4L266 146.4L271.6 150.3L271.6 150.4M271.6 159.9L271.5 160L270.9 160.3L270.6 160.3L270.4 160.2L264.8 156.4L264.7 156.3M271.6 150.4L271.6 159.9M264.7 146.7L264.7 156.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"267.6\" cy=\"149.4\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"7\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.3 233.2L296.5 233.1L297.1 232.9L297.4 232.8L297.6 232.9L303.2 236.7L303.2 236.9L303.2 246.4L303.1 246.5L302.5 246.7L302.2 246.8L302 246.7L296.4 242.9L296.3 242.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M303.2 246.4L303.1 246.5L303.1 237L303.2 236.9ZM303.1 246.5L302.5 246.7L302.5 237.2L303.1 237Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.5 246.7L302.2 246.8L302.2 237.2L302.5 237.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M302.2 246.8L302 246.7L302 237.2L302.2 237.2ZM302 246.7L296.4 242.9L296.4 233.3L302 237.2ZM296.4 242.9L296.3 242.7L296.3 233.2L296.4 233.3Z\"/><path class=\"iso-top\" d=\"M303.2 236.7L303.2 236.9L303.1 237L302.5 237.2L302.2 237.2L302 237.2L296.4 233.3L296.3 233.2L296.5 233.1L297.1 232.9L297.4 232.8L297.6 232.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M296.3 233.2L296.5 233.1L297.1 232.9L297.4 232.8L297.6 232.9L303.2 236.7L303.2 236.9M303.2 246.4L303.1 246.5L302.5 246.7L302.2 246.8L302 246.7L296.4 242.9L296.3 242.7M303.2 236.9L303.2 246.4M296.3 233.2L296.3 242.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"299.2\" cy=\"235.9\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"90\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241 78.7L241.2 78.5L241.8 78.3L242.1 78.3L242.3 78.3L247.9 82.2L248 82.3L248 91.8L247.8 92L247.2 92.2L246.9 92.2L246.7 92.2L241.1 88.3L241 88.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M248 91.8L247.8 92L247.8 82.4L248 82.3ZM247.8 92L247.2 92.2L247.2 82.7L247.8 82.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M247.2 92.2L246.9 92.2L246.9 82.7L247.2 82.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M246.9 92.2L246.7 92.2L246.7 82.6L246.9 82.7ZM246.7 92.2L241.1 88.3L241.1 78.8L246.7 82.6ZM241.1 88.3L241 88.2L241 78.7L241.1 78.8Z\"/><path class=\"iso-top\" d=\"M247.9 82.2L248 82.3L247.8 82.4L247.2 82.7L246.9 82.7L246.7 82.6L241.1 78.8L241 78.7L241.2 78.5L241.8 78.3L242.1 78.3L242.3 78.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241 78.7L241.2 78.5L241.8 78.3L242.1 78.3L242.3 78.3L247.9 82.2L248 82.3M248 91.8L247.8 92L247.2 92.2L246.9 92.2L246.7 92.2L241.1 88.3L241 88.2M248 82.3L248 91.8M241 78.7L241 88.2\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"243.9\" cy=\"81.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"44\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M272.6 165.1L272.8 165L273.4 164.8L273.7 164.7L273.9 164.8L279.5 168.6L279.5 168.8L279.5 178.3L279.4 178.4L278.8 178.7L278.5 178.7L278.3 178.6L272.7 174.8L272.6 174.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.5 178.3L279.4 178.4L279.4 168.9L279.5 168.8ZM279.4 178.4L278.8 178.7L278.8 169.1L279.4 168.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M278.8 178.7L278.5 178.7L278.5 169.2L278.8 169.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 178.7L278.3 178.6L278.3 169.1L278.5 169.2ZM278.3 178.6L272.7 174.8L272.7 165.2L278.3 169.1ZM272.7 174.8L272.6 174.7L272.6 165.1L272.7 165.2Z\"/><path class=\"iso-top\" d=\"M279.5 168.6L279.5 168.8L279.4 168.9L278.8 169.1L278.5 169.2L278.3 169.1L272.7 165.2L272.6 165.1L272.8 165L273.4 164.8L273.7 164.7L273.9 164.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M272.6 165.1L272.8 165L273.4 164.8L273.7 164.7L273.9 164.8L279.5 168.6L279.5 168.8M279.5 178.3L279.4 178.4L278.8 178.7L278.5 178.7L278.3 178.6L272.7 174.8L272.6 174.7M279.5 168.8L279.5 178.3M272.6 165.1L272.6 174.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"275.5\" cy=\"167.8\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"81\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M248.9 97L249.1 96.9L249.7 96.7L250 96.7L250.2 96.7L255.8 100.6L255.9 100.7L255.9 110.2L255.7 110.3L255.1 110.6L254.8 110.6L254.6 110.5L249 106.7L248.9 106.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M255.9 110.2L255.7 110.3L255.7 100.8L255.9 100.7ZM255.7 110.3L255.1 110.6L255.1 101L255.7 100.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M255.1 110.6L254.8 110.6L254.8 101.1L255.1 101Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M254.8 110.6L254.6 110.5L254.6 101L254.8 101.1ZM254.6 110.5L249 106.7L249 97.2L254.6 101ZM249 106.7L248.9 106.6L248.9 97L249 97.2Z\"/><path class=\"iso-top\" d=\"M255.8 100.6L255.9 100.7L255.7 100.8L255.1 101L254.8 101.1L254.6 101L249 97.2L248.9 97L249.1 96.9L249.7 96.7L250 96.7L250.2 96.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M248.9 97L249.1 96.9L249.7 96.7L250 96.7L250.2 96.7L255.8 100.6L255.9 100.7M255.9 110.2L255.7 110.3L255.1 110.6L254.8 110.6L254.6 110.5L249 106.7L248.9 106.6M255.9 100.7L255.9 110.2M248.9 97L248.9 106.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"251.8\" cy=\"99.7\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"35\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.5 183.5L280.7 183.4L281.3 183.1L281.6 183.1L281.8 183.2L287.4 187L287.4 187.2L287.4 196.7L287.3 196.8L286.7 197L286.4 197.1L286.2 197L280.6 193.2L280.5 193Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.4 196.7L287.3 196.8L287.3 187.3L287.4 187.2ZM287.3 196.8L286.7 197L286.7 187.5L287.3 187.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.7 197L286.4 197.1L286.4 187.5L286.7 187.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286.4 197.1L286.2 197L286.2 187.5L286.4 187.5ZM286.2 197L280.6 193.2L280.6 183.6L286.2 187.5ZM280.6 193.2L280.5 193L280.5 183.5L280.6 183.6Z\"/><path class=\"iso-top\" d=\"M287.4 187L287.4 187.2L287.3 187.3L286.7 187.5L286.4 187.5L286.2 187.5L280.6 183.6L280.5 183.5L280.7 183.4L281.3 183.1L281.6 183.1L281.8 183.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M280.5 183.5L280.7 183.4L281.3 183.1L281.6 183.1L281.8 183.2L287.4 187L287.4 187.2M287.4 196.7L287.3 196.8L286.7 197L286.4 197.1L286.2 197L280.6 193.2L280.5 193M287.4 187.2L287.4 196.7M280.5 183.5L280.5 193\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"283.4\" cy=\"186.2\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"72\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M256.8 115.4L257 115.3L257.6 115.1L257.9 115L258.1 115.1L263.7 118.9L263.8 119.1L263.8 128.6L263.6 128.7L263 129L262.7 129L262.5 128.9L256.9 125.1L256.8 124.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.8 128.6L263.6 128.7L263.6 119.2L263.8 119.1ZM263.6 128.7L263 129L263 119.4L263.6 119.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M263 129L262.7 129L262.7 119.5L263 119.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M262.7 129L262.5 128.9L262.5 119.4L262.7 119.5ZM262.5 128.9L256.9 125.1L256.9 115.5L262.5 119.4ZM256.9 125.1L256.8 124.9L256.8 115.4L256.9 115.5Z\"/><path class=\"iso-top\" d=\"M263.7 118.9L263.8 119.1L263.6 119.2L263 119.4L262.7 119.5L262.5 119.4L256.9 115.5L256.8 115.4L257 115.3L257.6 115.1L257.9 115L258.1 115.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M256.8 115.4L257 115.3L257.6 115.1L257.9 115L258.1 115.1L263.7 118.9L263.8 119.1M263.8 128.6L263.6 128.7L263 129L262.7 129L262.5 128.9L256.9 125.1L256.8 124.9M263.8 119.1L263.8 128.6M256.8 115.4L256.8 124.9\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"259.7\" cy=\"118.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"26\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M288.4 201.9L288.6 201.8L289.2 201.5L289.5 201.5L289.7 201.6L295.3 205.4L295.3 205.5L295.3 215.1L295.2 215.2L294.6 215.4L294.3 215.5L294.1 215.4L288.5 211.5L288.4 211.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M295.3 215.1L295.2 215.2L295.2 205.7L295.3 205.5ZM295.2 215.2L294.6 215.4L294.6 205.9L295.2 205.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M294.6 215.4L294.3 215.5L294.3 205.9L294.6 205.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 215.5L294.1 215.4L294.1 205.9L294.3 205.9ZM294.1 215.4L288.5 211.5L288.5 202L294.1 205.9ZM288.5 211.5L288.4 211.4L288.4 201.9L288.5 202Z\"/><path class=\"iso-top\" d=\"M295.3 205.4L295.3 205.5L295.2 205.7L294.6 205.9L294.3 205.9L294.1 205.9L288.5 202L288.4 201.9L288.6 201.8L289.2 201.5L289.5 201.5L289.7 201.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M288.4 201.9L288.6 201.8L289.2 201.5L289.5 201.5L289.7 201.6L295.3 205.4L295.3 205.5M295.3 215.1L295.2 215.2L294.6 215.4L294.3 215.5L294.1 215.4L288.5 211.5L288.4 211.4M295.3 205.5L295.3 215.1M288.4 201.9L288.4 211.4\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"291.3\" cy=\"204.5\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"63\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264.7 133.8L264.9 133.7L265.5 133.4L265.8 133.4L266 133.5L271.6 137.3L271.6 137.5L271.6 147L271.5 147.1L270.9 147.3L270.6 147.4L270.4 147.3L264.8 143.5L264.7 143.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.6 147L271.5 147.1L271.5 137.6L271.6 137.5ZM271.5 147.1L270.9 147.3L270.9 137.8L271.5 137.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.9 147.3L270.6 147.4L270.6 137.8L270.9 137.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M270.6 147.4L270.4 147.3L270.4 137.8L270.6 137.8ZM270.4 147.3L264.8 143.5L264.8 133.9L270.4 137.8ZM264.8 143.5L264.7 143.3L264.7 133.8L264.8 133.9Z\"/><path class=\"iso-top\" d=\"M271.6 137.3L271.6 137.5L271.5 137.6L270.9 137.8L270.6 137.8L270.4 137.8L264.8 133.9L264.7 133.8L264.9 133.7L265.5 133.4L265.8 133.4L266 133.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M264.7 133.8L264.9 133.7L265.5 133.4L265.8 133.4L266 133.5L271.6 137.3L271.6 137.5M271.6 147L271.5 147.1L270.9 147.3L270.6 147.4L270.4 147.3L264.8 143.5L264.7 143.3M271.6 137.5L271.6 147M264.7 133.8L264.7 143.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"267.6\" cy=\"136.4\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"17\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.3 220.3L296.5 220.1L297.1 219.9L297.4 219.9L297.6 219.9L303.2 223.8L303.2 223.9L303.2 233.5L303.1 233.6L302.5 233.8L302.2 233.8L302 233.8L296.4 229.9L296.3 229.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M303.2 233.5L303.1 233.6L303.1 224L303.2 223.9ZM303.1 233.6L302.5 233.8L302.5 224.3L303.1 224Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.5 233.8L302.2 233.8L302.2 224.3L302.5 224.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M302.2 233.8L302 233.8L302 224.2L302.2 224.3ZM302 233.8L296.4 229.9L296.4 220.4L302 224.2ZM296.4 229.9L296.3 229.8L296.3 220.3L296.4 220.4Z\"/><path class=\"iso-top\" d=\"M303.2 223.8L303.2 223.9L303.1 224L302.5 224.3L302.2 224.3L302 224.2L296.4 220.4L296.3 220.3L296.5 220.1L297.1 219.9L297.4 219.9L297.6 219.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M296.3 220.3L296.5 220.1L297.1 219.9L297.4 219.9L297.6 219.9L303.2 223.8L303.2 223.9M303.2 233.5L303.1 233.6L302.5 233.8L302.2 233.8L302 233.8L296.4 229.9L296.3 229.8M303.2 223.9L303.2 233.5M296.3 220.3L296.3 229.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"299.2\" cy=\"222.9\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"54\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M272.6 152.2L272.8 152.1L273.4 151.8L273.7 151.8L273.9 151.9L279.5 155.7L279.5 155.8L279.5 165.4L279.4 165.5L278.8 165.7L278.5 165.7L278.3 165.7L272.7 161.8L272.6 161.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.5 165.4L279.4 165.5L279.4 155.9L279.5 155.8ZM279.4 165.5L278.8 165.7L278.8 156.2L279.4 155.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M278.8 165.7L278.5 165.7L278.5 156.2L278.8 156.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 165.7L278.3 165.7L278.3 156.1L278.5 156.2ZM278.3 165.7L272.7 161.8L272.7 152.3L278.3 156.1ZM272.7 161.8L272.6 161.7L272.6 152.2L272.7 152.3Z\"/><path class=\"iso-top\" d=\"M279.5 155.7L279.5 155.8L279.4 155.9L278.8 156.2L278.5 156.2L278.3 156.1L272.7 152.3L272.6 152.2L272.8 152.1L273.4 151.8L273.7 151.8L273.9 151.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M272.6 152.2L272.8 152.1L273.4 151.8L273.7 151.8L273.9 151.9L279.5 155.7L279.5 155.8M279.5 165.4L279.4 165.5L278.8 165.7L278.5 165.7L278.3 165.7L272.7 161.8L272.6 161.7M279.5 155.8L279.5 165.4M272.6 152.2L272.6 161.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"275.5\" cy=\"154.8\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"8\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 238.6L304.4 238.5L305 238.3L305.3 238.3L305.5 238.3L311.1 242.2L311.1 242.3L311.1 251.8L311 251.9L310.4 252.2L310.1 252.2L309.9 252.1L304.3 248.3L304.2 248.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.1 251.8L311 251.9L311 242.4L311.1 242.3ZM311 251.9L310.4 252.2L310.4 242.7L311 242.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M310.4 252.2L310.1 252.2L310.1 242.7L310.4 242.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M310.1 252.2L309.9 252.1L309.9 242.6L310.1 242.7ZM309.9 252.1L304.3 248.3L304.3 238.8L309.9 242.6ZM304.3 248.3L304.2 248.2L304.2 238.6L304.3 238.8Z\"/><path class=\"iso-top\" d=\"M311.1 242.2L311.1 242.3L311 242.4L310.4 242.7L310.1 242.7L309.9 242.6L304.3 238.8L304.2 238.6L304.4 238.5L305 238.3L305.3 238.3L305.5 238.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M304.2 238.6L304.4 238.5L305 238.3L305.3 238.3L305.5 238.3L311.1 242.2L311.1 242.3M311.1 251.8L311 251.9L310.4 252.2L310.1 252.2L309.9 252.1L304.3 248.3L304.2 248.2M311.1 242.3L311.1 251.8M304.2 238.6L304.2 248.2\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"307.1\" cy=\"241.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"91\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M248.9 84.1L249.1 84L249.7 83.7L250 83.7L250.2 83.8L255.8 87.6L255.9 87.8L255.9 97.3L255.7 97.4L255.1 97.6L254.8 97.7L254.6 97.6L249 93.8L248.9 93.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M255.9 97.3L255.7 97.4L255.7 87.9L255.9 87.8ZM255.7 97.4L255.1 97.6L255.1 88.1L255.7 87.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M255.1 97.6L254.8 97.7L254.8 88.1L255.1 88.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M254.8 97.7L254.6 97.6L254.6 88.1L254.8 88.1ZM254.6 97.6L249 93.8L249 84.2L254.6 88.1ZM249 93.8L248.9 93.6L248.9 84.1L249 84.2Z\"/><path class=\"iso-top\" d=\"M255.8 87.6L255.9 87.8L255.7 87.9L255.1 88.1L254.8 88.1L254.6 88.1L249 84.2L248.9 84.1L249.1 84L249.7 83.7L250 83.7L250.2 83.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M248.9 84.1L249.1 84L249.7 83.7L250 83.7L250.2 83.8L255.8 87.6L255.9 87.8M255.9 97.3L255.7 97.4L255.1 97.6L254.8 97.7L254.6 97.6L249 93.8L248.9 93.6M255.9 87.8L255.9 97.3M248.9 84.1L248.9 93.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"251.8\" cy=\"86.7\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"45\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.5 170.6L280.7 170.4L281.3 170.2L281.6 170.2L281.8 170.2L287.4 174.1L287.4 174.2L287.4 183.7L287.3 183.9L286.7 184.1L286.4 184.1L286.2 184.1L280.6 180.2L280.5 180.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.4 183.7L287.3 183.9L287.3 174.3L287.4 174.2ZM287.3 183.9L286.7 184.1L286.7 174.6L287.3 174.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.7 184.1L286.4 184.1L286.4 174.6L286.7 174.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286.4 184.1L286.2 184.1L286.2 174.5L286.4 174.6ZM286.2 184.1L280.6 180.2L280.6 170.7L286.2 174.5ZM280.6 180.2L280.5 180.1L280.5 170.6L280.6 170.7Z\"/><path class=\"iso-top\" d=\"M287.4 174.1L287.4 174.2L287.3 174.3L286.7 174.6L286.4 174.6L286.2 174.5L280.6 170.7L280.5 170.6L280.7 170.4L281.3 170.2L281.6 170.2L281.8 170.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M280.5 170.6L280.7 170.4L281.3 170.2L281.6 170.2L281.8 170.2L287.4 174.1L287.4 174.2M287.4 183.7L287.3 183.9L286.7 184.1L286.4 184.1L286.2 184.1L280.6 180.2L280.5 180.1M287.4 174.2L287.4 183.7M280.5 170.6L280.5 180.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"283.4\" cy=\"173.2\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"82\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M256.8 102.5L257 102.4L257.6 102.1L257.9 102.1L258.1 102.2L263.7 106L263.8 106.1L263.8 115.7L263.6 115.8L263 116L262.7 116L262.5 116L256.9 112.1L256.8 112Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.8 115.7L263.6 115.8L263.6 106.2L263.8 106.1ZM263.6 115.8L263 116L263 106.5L263.6 106.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M263 116L262.7 116L262.7 106.5L263 106.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M262.7 116L262.5 116L262.5 106.4L262.7 106.5ZM262.5 116L256.9 112.1L256.9 102.6L262.5 106.4ZM256.9 112.1L256.8 112L256.8 102.5L256.9 102.6Z\"/><path class=\"iso-top\" d=\"M263.7 106L263.8 106.1L263.6 106.2L263 106.5L262.7 106.5L262.5 106.4L256.9 102.6L256.8 102.5L257 102.4L257.6 102.1L257.9 102.1L258.1 102.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M256.8 102.5L257 102.4L257.6 102.1L257.9 102.1L258.1 102.2L263.7 106L263.8 106.1M263.8 115.7L263.6 115.8L263 116L262.7 116L262.5 116L256.9 112.1L256.8 112M263.8 106.1L263.8 115.7M256.8 102.5L256.8 112\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"259.7\" cy=\"105.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"36\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M288.4 188.9L288.6 188.8L289.2 188.6L289.5 188.6L289.7 188.6L295.3 192.5L295.3 192.6L295.3 202.1L295.2 202.2L294.6 202.5L294.3 202.5L294.1 202.4L288.5 198.6L288.4 198.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M295.3 202.1L295.2 202.2L295.2 192.7L295.3 192.6ZM295.2 202.2L294.6 202.5L294.6 192.9L295.2 192.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M294.6 202.5L294.3 202.5L294.3 193L294.6 192.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 202.5L294.1 202.4L294.1 192.9L294.3 193ZM294.1 202.4L288.5 198.6L288.5 189.1L294.1 192.9ZM288.5 198.6L288.4 198.5L288.4 188.9L288.5 189.1Z\"/><path class=\"iso-top\" d=\"M295.3 192.5L295.3 192.6L295.2 192.7L294.6 192.9L294.3 193L294.1 192.9L288.5 189.1L288.4 188.9L288.6 188.8L289.2 188.6L289.5 188.6L289.7 188.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M288.4 188.9L288.6 188.8L289.2 188.6L289.5 188.6L289.7 188.6L295.3 192.5L295.3 192.6M295.3 202.1L295.2 202.2L294.6 202.5L294.3 202.5L294.1 202.4L288.5 198.6L288.4 198.5M295.3 192.6L295.3 202.1M288.4 188.9L288.4 198.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"291.3\" cy=\"191.6\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"73\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264.7 120.9L264.9 120.7L265.5 120.5L265.8 120.5L266 120.5L271.6 124.4L271.6 124.5L271.6 134L271.5 134.2L270.9 134.4L270.6 134.4L270.4 134.4L264.8 130.5L264.7 130.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.6 134L271.5 134.2L271.5 124.6L271.6 124.5ZM271.5 134.2L270.9 134.4L270.9 124.9L271.5 124.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.9 134.4L270.6 134.4L270.6 124.9L270.9 124.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M270.6 134.4L270.4 134.4L270.4 124.8L270.6 124.9ZM270.4 134.4L264.8 130.5L264.8 121L270.4 124.8ZM264.8 130.5L264.7 130.4L264.7 120.9L264.8 121Z\"/><path class=\"iso-top\" d=\"M271.6 124.4L271.6 124.5L271.5 124.6L270.9 124.9L270.6 124.9L270.4 124.8L264.8 121L264.7 120.9L264.9 120.7L265.5 120.5L265.8 120.5L266 120.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M264.7 120.9L264.9 120.7L265.5 120.5L265.8 120.5L266 120.5L271.6 124.4L271.6 124.5M271.6 134L271.5 134.2L270.9 134.4L270.6 134.4L270.4 134.4L264.8 130.5L264.7 130.4M271.6 124.5L271.6 134M264.7 120.9L264.7 130.4\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"267.6\" cy=\"123.5\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"27\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.3 207.3L296.5 207.2L297.1 207L297.4 206.9L297.6 207L303.2 210.8L303.2 211L303.2 220.5L303.1 220.6L302.5 220.9L302.2 220.9L302 220.8L296.4 217L296.3 216.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M303.2 220.5L303.1 220.6L303.1 211.1L303.2 211ZM303.1 220.6L302.5 220.9L302.5 211.3L303.1 211.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.5 220.9L302.2 220.9L302.2 211.4L302.5 211.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M302.2 220.9L302 220.8L302 211.3L302.2 211.4ZM302 220.8L296.4 217L296.4 207.4L302 211.3ZM296.4 217L296.3 216.8L296.3 207.3L296.4 207.4Z\"/><path class=\"iso-top\" d=\"M303.2 210.8L303.2 211L303.1 211.1L302.5 211.3L302.2 211.4L302 211.3L296.4 207.4L296.3 207.3L296.5 207.2L297.1 207L297.4 206.9L297.6 207Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M296.3 207.3L296.5 207.2L297.1 207L297.4 206.9L297.6 207L303.2 210.8L303.2 211M303.2 220.5L303.1 220.6L302.5 220.9L302.2 220.9L302 220.8L296.4 217L296.3 216.8M303.2 211L303.2 220.5M296.3 207.3L296.3 216.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"299.2\" cy=\"210\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"64\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M272.6 139.2L272.8 139.1L273.4 138.9L273.7 138.8L273.9 138.9L279.5 142.8L279.5 142.9L279.5 152.4L279.4 152.5L278.8 152.8L278.5 152.8L278.3 152.7L272.7 148.9L272.6 148.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.5 152.4L279.4 152.5L279.4 143L279.5 142.9ZM279.4 152.5L278.8 152.8L278.8 143.2L279.4 143Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M278.8 152.8L278.5 152.8L278.5 143.3L278.8 143.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 152.8L278.3 152.7L278.3 143.2L278.5 143.3ZM278.3 152.7L272.7 148.9L272.7 139.4L278.3 143.2ZM272.7 148.9L272.6 148.8L272.6 139.2L272.7 139.4Z\"/><path class=\"iso-top\" d=\"M279.5 142.8L279.5 142.9L279.4 143L278.8 143.2L278.5 143.3L278.3 143.2L272.7 139.4L272.6 139.2L272.8 139.1L273.4 138.9L273.7 138.8L273.9 138.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M272.6 139.2L272.8 139.1L273.4 138.9L273.7 138.8L273.9 138.9L279.5 142.8L279.5 142.9M279.5 152.4L279.4 152.5L278.8 152.8L278.5 152.8L278.3 152.7L272.7 148.9L272.6 148.8M279.5 142.9L279.5 152.4M272.6 139.2L272.6 148.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"275.5\" cy=\"141.9\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"18\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 225.7L304.4 225.6L305 225.3L305.3 225.3L305.5 225.4L311.1 229.2L311.1 229.4L311.1 238.9L311 239L310.4 239.2L310.1 239.3L309.9 239.2L304.3 235.4L304.2 235.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.1 238.9L311 239L311 229.5L311.1 229.4ZM311 239L310.4 239.2L310.4 229.7L311 229.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M310.4 239.2L310.1 239.3L310.1 229.7L310.4 229.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M310.1 239.3L309.9 239.2L309.9 229.7L310.1 229.7ZM309.9 239.2L304.3 235.4L304.3 225.8L309.9 229.7ZM304.3 235.4L304.2 235.2L304.2 225.7L304.3 225.8Z\"/><path class=\"iso-top\" d=\"M311.1 229.2L311.1 229.4L311 229.5L310.4 229.7L310.1 229.7L309.9 229.7L304.3 225.8L304.2 225.7L304.4 225.6L305 225.3L305.3 225.3L305.5 225.4Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M304.2 225.7L304.4 225.6L305 225.3L305.3 225.3L305.5 225.4L311.1 229.2L311.1 229.4M311.1 238.9L311 239L310.4 239.2L310.1 239.3L309.9 239.2L304.3 235.4L304.2 235.2M311.1 229.4L311.1 238.9M304.2 225.7L304.2 235.2\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"307.1\" cy=\"228.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"55\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.5 157.6L280.7 157.5L281.3 157.3L281.6 157.2L281.8 157.3L287.4 161.1L287.4 161.3L287.4 170.8L287.3 170.9L286.7 171.2L286.4 171.2L286.2 171.1L280.6 167.3L280.5 167.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.4 170.8L287.3 170.9L287.3 161.4L287.4 161.3ZM287.3 170.9L286.7 171.2L286.7 161.6L287.3 161.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.7 171.2L286.4 171.2L286.4 161.7L286.7 161.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286.4 171.2L286.2 171.1L286.2 161.6L286.4 161.7ZM286.2 171.1L280.6 167.3L280.6 157.7L286.2 161.6ZM280.6 167.3L280.5 167.1L280.5 157.6L280.6 157.7Z\"/><path class=\"iso-top\" d=\"M287.4 161.1L287.4 161.3L287.3 161.4L286.7 161.6L286.4 161.7L286.2 161.6L280.6 157.7L280.5 157.6L280.7 157.5L281.3 157.3L281.6 157.2L281.8 157.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M280.5 157.6L280.7 157.5L281.3 157.3L281.6 157.2L281.8 157.3L287.4 161.1L287.4 161.3M287.4 170.8L287.3 170.9L286.7 171.2L286.4 171.2L286.2 171.1L280.6 167.3L280.5 167.1M287.4 161.3L287.4 170.8M280.5 157.6L280.5 167.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"283.4\" cy=\"160.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"9\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M312.1 244.1L312.3 244L312.9 243.7L313.2 243.7L313.4 243.8L319 247.6L319 247.7L319 257.3L318.9 257.4L318.3 257.6L318 257.7L317.8 257.6L312.2 253.7L312.1 253.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 257.3L318.9 257.4L318.9 247.8L319 247.7ZM318.9 257.4L318.3 257.6L318.3 248.1L318.9 247.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M318.3 257.6L318 257.7L318 248.1L318.3 248.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M318 257.7L317.8 257.6L317.8 248L318 248.1ZM317.8 257.6L312.2 253.7L312.2 244.2L317.8 248ZM312.2 253.7L312.1 253.6L312.1 244.1L312.2 244.2Z\"/><path class=\"iso-top\" d=\"M319 247.6L319 247.7L318.9 247.8L318.3 248.1L318 248.1L317.8 248L312.2 244.2L312.1 244.1L312.3 244L312.9 243.7L313.2 243.7L313.4 243.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M312.1 244.1L312.3 244L312.9 243.7L313.2 243.7L313.4 243.8L319 247.6L319 247.7M319 257.3L318.9 257.4L318.3 257.6L318 257.7L317.8 257.6L312.2 253.7L312.1 253.6M319 247.7L319 257.3M312.1 244.1L312.1 253.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"315\" cy=\"246.7\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"92\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M256.8 89.5L257 89.4L257.6 89.2L257.9 89.1L258.1 89.2L263.7 93.1L263.8 93.2L263.8 102.7L263.6 102.8L263 103.1L262.7 103.1L262.5 103L256.9 99.2L256.8 99.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.8 102.7L263.6 102.8L263.6 93.3L263.8 93.2ZM263.6 102.8L263 103.1L263 93.5L263.6 93.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M263 103.1L262.7 103.1L262.7 93.6L263 93.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M262.7 103.1L262.5 103L262.5 93.5L262.7 93.6ZM262.5 103L256.9 99.2L256.9 89.7L262.5 93.5ZM256.9 99.2L256.8 99.1L256.8 89.5L256.9 89.7Z\"/><path class=\"iso-top\" d=\"M263.7 93.1L263.8 93.2L263.6 93.3L263 93.5L262.7 93.6L262.5 93.5L256.9 89.7L256.8 89.5L257 89.4L257.6 89.2L257.9 89.1L258.1 89.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M256.8 89.5L257 89.4L257.6 89.2L257.9 89.1L258.1 89.2L263.7 93.1L263.8 93.2M263.8 102.7L263.6 102.8L263 103.1L262.7 103.1L262.5 103L256.9 99.2L256.8 99.1M263.8 93.2L263.8 102.7M256.8 89.5L256.8 99.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"259.7\" cy=\"92.2\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"46\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M288.4 176L288.6 175.9L289.2 175.6L289.5 175.6L289.7 175.7L295.3 179.5L295.3 179.7L295.3 189.2L295.2 189.3L294.6 189.5L294.3 189.6L294.1 189.5L288.5 185.7L288.4 185.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M295.3 189.2L295.2 189.3L295.2 179.8L295.3 179.7ZM295.2 189.3L294.6 189.5L294.6 180L295.2 179.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M294.6 189.5L294.3 189.6L294.3 180L294.6 180Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 189.6L294.1 189.5L294.1 180L294.3 180ZM294.1 189.5L288.5 185.7L288.5 176.1L294.1 180ZM288.5 185.7L288.4 185.5L288.4 176L288.5 176.1Z\"/><path class=\"iso-top\" d=\"M295.3 179.5L295.3 179.7L295.2 179.8L294.6 180L294.3 180L294.1 180L288.5 176.1L288.4 176L288.6 175.9L289.2 175.6L289.5 175.6L289.7 175.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M288.4 176L288.6 175.9L289.2 175.6L289.5 175.6L289.7 175.7L295.3 179.5L295.3 179.7M295.3 189.2L295.2 189.3L294.6 189.5L294.3 189.6L294.1 189.5L288.5 185.7L288.4 185.5M295.3 179.7L295.3 189.2M288.4 176L288.4 185.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"291.3\" cy=\"178.6\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"83\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264.7 107.9L264.9 107.8L265.5 107.6L265.8 107.5L266 107.6L271.6 111.4L271.6 111.6L271.6 121.1L271.5 121.2L270.9 121.5L270.6 121.5L270.4 121.4L264.8 117.6L264.7 117.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.6 121.1L271.5 121.2L271.5 111.7L271.6 111.6ZM271.5 121.2L270.9 121.5L270.9 111.9L271.5 111.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.9 121.5L270.6 121.5L270.6 111.9L270.9 111.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M270.6 121.5L270.4 121.4L270.4 111.9L270.6 111.9ZM270.4 121.4L264.8 117.6L264.8 108L270.4 111.9ZM264.8 117.6L264.7 117.4L264.7 107.9L264.8 108Z\"/><path class=\"iso-top\" d=\"M271.6 111.4L271.6 111.6L271.5 111.7L270.9 111.9L270.6 111.9L270.4 111.9L264.8 108L264.7 107.9L264.9 107.8L265.5 107.6L265.8 107.5L266 107.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M264.7 107.9L264.9 107.8L265.5 107.6L265.8 107.5L266 107.6L271.6 111.4L271.6 111.6M271.6 121.1L271.5 121.2L270.9 121.5L270.6 121.5L270.4 121.4L264.8 117.6L264.7 117.4M271.6 111.6L271.6 121.1M264.7 107.9L264.7 117.4\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"267.6\" cy=\"110.6\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"37\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.3 194.4L296.5 194.3L297.1 194L297.4 194L297.6 194.1L303.2 197.9L303.2 198L303.2 207.6L303.1 207.7L302.5 207.9L302.2 207.9L302 207.9L296.4 204L296.3 203.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M303.2 207.6L303.1 207.7L303.1 198.1L303.2 198ZM303.1 207.7L302.5 207.9L302.5 198.4L303.1 198.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.5 207.9L302.2 207.9L302.2 198.4L302.5 198.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M302.2 207.9L302 207.9L302 198.3L302.2 198.4ZM302 207.9L296.4 204L296.4 194.5L302 198.3ZM296.4 204L296.3 203.9L296.3 194.4L296.4 194.5Z\"/><path class=\"iso-top\" d=\"M303.2 197.9L303.2 198L303.1 198.1L302.5 198.4L302.2 198.4L302 198.3L296.4 194.5L296.3 194.4L296.5 194.3L297.1 194L297.4 194L297.6 194.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M296.3 194.4L296.5 194.3L297.1 194L297.4 194L297.6 194.1L303.2 197.9L303.2 198M303.2 207.6L303.1 207.7L302.5 207.9L302.2 207.9L302 207.9L296.4 204L296.3 203.9M303.2 198L303.2 207.6M296.3 194.4L296.3 203.9\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"299.2\" cy=\"197\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"74\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M272.6 126.3L272.8 126.2L273.4 125.9L273.7 125.9L273.9 126L279.5 129.8L279.5 129.9L279.5 139.5L279.4 139.6L278.8 139.8L278.5 139.9L278.3 139.8L272.7 135.9L272.6 135.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.5 139.5L279.4 139.6L279.4 130.1L279.5 129.9ZM279.4 139.6L278.8 139.8L278.8 130.3L279.4 130.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M278.8 139.8L278.5 139.9L278.5 130.3L278.8 130.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 139.9L278.3 139.8L278.3 130.3L278.5 130.3ZM278.3 139.8L272.7 135.9L272.7 126.4L278.3 130.3ZM272.7 135.9L272.6 135.8L272.6 126.3L272.7 126.4Z\"/><path class=\"iso-top\" d=\"M279.5 129.8L279.5 129.9L279.4 130.1L278.8 130.3L278.5 130.3L278.3 130.3L272.7 126.4L272.6 126.3L272.8 126.2L273.4 125.9L273.7 125.9L273.9 126Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M272.6 126.3L272.8 126.2L273.4 125.9L273.7 125.9L273.9 126L279.5 129.8L279.5 129.9M279.5 139.5L279.4 139.6L278.8 139.8L278.5 139.9L278.3 139.8L272.7 135.9L272.6 135.8M279.5 129.9L279.5 139.5M272.6 126.3L272.6 135.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"275.5\" cy=\"128.9\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"28\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 212.8L304.4 212.6L305 212.4L305.3 212.4L305.5 212.4L311.1 216.3L311.1 216.4L311.1 225.9L311 226.1L310.4 226.3L310.1 226.3L309.9 226.3L304.3 222.4L304.2 222.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.1 225.9L311 226.1L311 216.5L311.1 216.4ZM311 226.1L310.4 226.3L310.4 216.8L311 216.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M310.4 226.3L310.1 226.3L310.1 216.8L310.4 216.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M310.1 226.3L309.9 226.3L309.9 216.7L310.1 216.8ZM309.9 226.3L304.3 222.4L304.3 212.9L309.9 216.7ZM304.3 222.4L304.2 222.3L304.2 212.8L304.3 212.9Z\"/><path class=\"iso-top\" d=\"M311.1 216.3L311.1 216.4L311 216.5L310.4 216.8L310.1 216.8L309.9 216.7L304.3 212.9L304.2 212.8L304.4 212.6L305 212.4L305.3 212.4L305.5 212.4Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M304.2 212.8L304.4 212.6L305 212.4L305.3 212.4L305.5 212.4L311.1 216.3L311.1 216.4M311.1 225.9L311 226.1L310.4 226.3L310.1 226.3L309.9 226.3L304.3 222.4L304.2 222.3M311.1 216.4L311.1 225.9M304.2 212.8L304.2 222.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"307.1\" cy=\"215.4\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"65\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.5 144.7L280.7 144.6L281.3 144.3L281.6 144.3L281.8 144.4L287.4 148.2L287.4 148.3L287.4 157.9L287.3 158L286.7 158.2L286.4 158.2L286.2 158.2L280.6 154.3L280.5 154.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.4 157.9L287.3 158L287.3 148.4L287.4 148.3ZM287.3 158L286.7 158.2L286.7 148.7L287.3 148.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.7 158.2L286.4 158.2L286.4 148.7L286.7 148.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286.4 158.2L286.2 158.2L286.2 148.6L286.4 148.7ZM286.2 158.2L280.6 154.3L280.6 144.8L286.2 148.6ZM280.6 154.3L280.5 154.2L280.5 144.7L280.6 144.8Z\"/><path class=\"iso-top\" d=\"M287.4 148.2L287.4 148.3L287.3 148.4L286.7 148.7L286.4 148.7L286.2 148.6L280.6 144.8L280.5 144.7L280.7 144.6L281.3 144.3L281.6 144.3L281.8 144.4Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M280.5 144.7L280.7 144.6L281.3 144.3L281.6 144.3L281.8 144.4L287.4 148.2L287.4 148.3M287.4 157.9L287.3 158L286.7 158.2L286.4 158.2L286.2 158.2L280.6 154.3L280.5 154.2M287.4 148.3L287.4 157.9M280.5 144.7L280.5 154.2\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"283.4\" cy=\"147.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"19\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M312.1 231.1L312.3 231L312.9 230.8L313.2 230.7L313.4 230.8L319 234.7L319 234.8L319 244.3L318.9 244.4L318.3 244.7L318 244.7L317.8 244.6L312.2 240.8L312.1 240.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 244.3L318.9 244.4L318.9 234.9L319 234.8ZM318.9 244.4L318.3 244.7L318.3 235.1L318.9 234.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M318.3 244.7L318 244.7L318 235.2L318.3 235.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M318 244.7L317.8 244.6L317.8 235.1L318 235.2ZM317.8 244.6L312.2 240.8L312.2 231.3L317.8 235.1ZM312.2 240.8L312.1 240.7L312.1 231.1L312.2 231.3Z\"/><path class=\"iso-top\" d=\"M319 234.7L319 234.8L318.9 234.9L318.3 235.1L318 235.2L317.8 235.1L312.2 231.3L312.1 231.1L312.3 231L312.9 230.8L313.2 230.7L313.4 230.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M312.1 231.1L312.3 231L312.9 230.8L313.2 230.7L313.4 230.8L319 234.7L319 234.8M319 244.3L318.9 244.4L318.3 244.7L318 244.7L317.8 244.6L312.2 240.8L312.1 240.7M319 234.8L319 244.3M312.1 231.1L312.1 240.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"315\" cy=\"233.8\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"56\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M288.4 163L288.6 162.9L289.2 162.7L289.5 162.7L289.7 162.7L295.3 166.6L295.3 166.7L295.3 176.2L295.2 176.4L294.6 176.6L294.3 176.6L294.1 176.6L288.5 172.7L288.4 172.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M295.3 176.2L295.2 176.4L295.2 166.8L295.3 166.7ZM295.2 176.4L294.6 176.6L294.6 167.1L295.2 166.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M294.6 176.6L294.3 176.6L294.3 167.1L294.6 167.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 176.6L294.1 176.6L294.1 167L294.3 167.1ZM294.1 176.6L288.5 172.7L288.5 163.2L294.1 167ZM288.5 172.7L288.4 172.6L288.4 163L288.5 163.2Z\"/><path class=\"iso-top\" d=\"M295.3 166.6L295.3 166.7L295.2 166.8L294.6 167.1L294.3 167.1L294.1 167L288.5 163.2L288.4 163L288.6 162.9L289.2 162.7L289.5 162.7L289.7 162.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M288.4 163L288.6 162.9L289.2 162.7L289.5 162.7L289.7 162.7L295.3 166.6L295.3 166.7M295.3 176.2L295.2 176.4L294.6 176.6L294.3 176.6L294.1 176.6L288.5 172.7L288.4 172.6M295.3 166.7L295.3 176.2M288.4 163L288.4 172.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"291.3\" cy=\"165.7\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"93\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264.7 95L264.9 94.9L265.5 94.6L265.8 94.6L266 94.7L271.6 98.5L271.6 98.6L271.6 108.2L271.5 108.3L270.9 108.5L270.6 108.5L270.4 108.5L264.8 104.6L264.7 104.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.6 108.2L271.5 108.3L271.5 98.7L271.6 98.6ZM271.5 108.3L270.9 108.5L270.9 99L271.5 98.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.9 108.5L270.6 108.5L270.6 99L270.9 99Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M270.6 108.5L270.4 108.5L270.4 98.9L270.6 99ZM270.4 108.5L264.8 104.6L264.8 95.1L270.4 98.9ZM264.8 104.6L264.7 104.5L264.7 95L264.8 95.1Z\"/><path class=\"iso-top\" d=\"M271.6 98.5L271.6 98.6L271.5 98.7L270.9 99L270.6 99L270.4 98.9L264.8 95.1L264.7 95L264.9 94.9L265.5 94.6L265.8 94.6L266 94.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M264.7 95L264.9 94.9L265.5 94.6L265.8 94.6L266 94.7L271.6 98.5L271.6 98.6M271.6 108.2L271.5 108.3L270.9 108.5L270.6 108.5L270.4 108.5L264.8 104.6L264.7 104.5M271.6 98.6L271.6 108.2M264.7 95L264.7 104.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"267.6\" cy=\"97.6\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"47\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.3 181.4L296.5 181.3L297.1 181.1L297.4 181L297.6 181.1L303.2 185L303.2 185.1L303.2 194.6L303.1 194.7L302.5 195L302.2 195L302 194.9L296.4 191.1L296.3 191Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M303.2 194.6L303.1 194.7L303.1 185.2L303.2 185.1ZM303.1 194.7L302.5 195L302.5 185.4L303.1 185.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.5 195L302.2 195L302.2 185.5L302.5 185.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M302.2 195L302 194.9L302 185.4L302.2 185.5ZM302 194.9L296.4 191.1L296.4 181.6L302 185.4ZM296.4 191.1L296.3 191L296.3 181.4L296.4 181.6Z\"/><path class=\"iso-top\" d=\"M303.2 185L303.2 185.1L303.1 185.2L302.5 185.4L302.2 185.5L302 185.4L296.4 181.6L296.3 181.4L296.5 181.3L297.1 181.1L297.4 181L297.6 181.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M296.3 181.4L296.5 181.3L297.1 181.1L297.4 181L297.6 181.1L303.2 185L303.2 185.1M303.2 194.6L303.1 194.7L302.5 195L302.2 195L302 194.9L296.4 191.1L296.3 191M303.2 185.1L303.2 194.6M296.3 181.4L296.3 191\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"299.2\" cy=\"184.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"84\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M272.6 113.3L272.8 113.2L273.4 113L273.7 113L273.9 113L279.5 116.9L279.5 117L279.5 126.5L279.4 126.6L278.8 126.9L278.5 126.9L278.3 126.8L272.7 123L272.6 122.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.5 126.5L279.4 126.6L279.4 117.1L279.5 117ZM279.4 126.6L278.8 126.9L278.8 117.4L279.4 117.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M278.8 126.9L278.5 126.9L278.5 117.4L278.8 117.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 126.9L278.3 126.8L278.3 117.3L278.5 117.4ZM278.3 126.8L272.7 123L272.7 113.5L278.3 117.3ZM272.7 123L272.6 122.9L272.6 113.3L272.7 113.5Z\"/><path class=\"iso-top\" d=\"M279.5 116.9L279.5 117L279.4 117.1L278.8 117.4L278.5 117.4L278.3 117.3L272.7 113.5L272.6 113.3L272.8 113.2L273.4 113L273.7 113L273.9 113Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M272.6 113.3L272.8 113.2L273.4 113L273.7 113L273.9 113L279.5 116.9L279.5 117M279.5 126.5L279.4 126.6L278.8 126.9L278.5 126.9L278.3 126.8L272.7 123L272.6 122.9M279.5 117L279.5 126.5M272.6 113.3L272.6 122.9\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"275.5\" cy=\"116\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"38\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 199.8L304.4 199.7L305 199.5L305.3 199.4L305.5 199.5L311.1 203.3L311.1 203.5L311.1 213L311 213.1L310.4 213.4L310.1 213.4L309.9 213.3L304.3 209.5L304.2 209.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.1 213L311 213.1L311 203.6L311.1 203.5ZM311 213.1L310.4 213.4L310.4 203.8L311 203.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M310.4 213.4L310.1 213.4L310.1 203.9L310.4 203.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M310.1 213.4L309.9 213.3L309.9 203.8L310.1 203.9ZM309.9 213.3L304.3 209.5L304.3 199.9L309.9 203.8ZM304.3 209.5L304.2 209.3L304.2 199.8L304.3 199.9Z\"/><path class=\"iso-top\" d=\"M311.1 203.3L311.1 203.5L311 203.6L310.4 203.8L310.1 203.9L309.9 203.8L304.3 199.9L304.2 199.8L304.4 199.7L305 199.5L305.3 199.4L305.5 199.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M304.2 199.8L304.4 199.7L305 199.5L305.3 199.4L305.5 199.5L311.1 203.3L311.1 203.5M311.1 213L311 213.1L310.4 213.4L310.1 213.4L309.9 213.3L304.3 209.5L304.2 209.3M311.1 203.5L311.1 213M304.2 199.8L304.2 209.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"307.1\" cy=\"202.5\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"75\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.5 131.7L280.7 131.6L281.3 131.4L281.6 131.3L281.8 131.4L287.4 135.3L287.4 135.4L287.4 144.9L287.3 145L286.7 145.3L286.4 145.3L286.2 145.2L280.6 141.4L280.5 141.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.4 144.9L287.3 145L287.3 135.5L287.4 135.4ZM287.3 145L286.7 145.3L286.7 135.7L287.3 135.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.7 145.3L286.4 145.3L286.4 135.8L286.7 135.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286.4 145.3L286.2 145.2L286.2 135.7L286.4 135.8ZM286.2 145.2L280.6 141.4L280.6 131.9L286.2 135.7ZM280.6 141.4L280.5 141.3L280.5 131.7L280.6 131.9Z\"/><path class=\"iso-top\" d=\"M287.4 135.3L287.4 135.4L287.3 135.5L286.7 135.7L286.4 135.8L286.2 135.7L280.6 131.9L280.5 131.7L280.7 131.6L281.3 131.4L281.6 131.3L281.8 131.4Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M280.5 131.7L280.7 131.6L281.3 131.4L281.6 131.3L281.8 131.4L287.4 135.3L287.4 135.4M287.4 144.9L287.3 145L286.7 145.3L286.4 145.3L286.2 145.2L280.6 141.4L280.5 141.3M287.4 135.4L287.4 144.9M280.5 131.7L280.5 141.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"283.4\" cy=\"134.4\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"29\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M312.1 218.2L312.3 218.1L312.9 217.8L313.2 217.8L313.4 217.9L319 221.7L319 221.8L319 231.4L318.9 231.5L318.3 231.7L318 231.8L317.8 231.7L312.2 227.9L312.1 227.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 231.4L318.9 231.5L318.9 222L319 221.8ZM318.9 231.5L318.3 231.7L318.3 222.2L318.9 222Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M318.3 231.7L318 231.8L318 222.2L318.3 222.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M318 231.8L317.8 231.7L317.8 222.2L318 222.2ZM317.8 231.7L312.2 227.9L312.2 218.3L317.8 222.2ZM312.2 227.9L312.1 227.7L312.1 218.2L312.2 218.3Z\"/><path class=\"iso-top\" d=\"M319 221.7L319 221.8L318.9 222L318.3 222.2L318 222.2L317.8 222.2L312.2 218.3L312.1 218.2L312.3 218.1L312.9 217.8L313.2 217.8L313.4 217.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M312.1 218.2L312.3 218.1L312.9 217.8L313.2 217.8L313.4 217.9L319 221.7L319 221.8M319 231.4L318.9 231.5L318.3 231.7L318 231.8L317.8 231.7L312.2 227.9L312.1 227.7M319 221.8L319 231.4M312.1 218.2L312.1 227.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"315\" cy=\"220.8\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"66\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M288.4 150.1L288.6 150L289.2 149.8L289.5 149.7L289.7 149.8L295.3 153.6L295.3 153.8L295.3 163.3L295.2 163.4L294.6 163.6L294.3 163.7L294.1 163.6L288.5 159.8L288.4 159.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M295.3 163.3L295.2 163.4L295.2 153.9L295.3 153.8ZM295.2 163.4L294.6 163.6L294.6 154.1L295.2 153.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M294.6 163.6L294.3 163.7L294.3 154.1L294.6 154.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 163.7L294.1 163.6L294.1 154.1L294.3 154.1ZM294.1 163.6L288.5 159.8L288.5 150.2L294.1 154.1ZM288.5 159.8L288.4 159.6L288.4 150.1L288.5 150.2Z\"/><path class=\"iso-top\" d=\"M295.3 153.6L295.3 153.8L295.2 153.9L294.6 154.1L294.3 154.1L294.1 154.1L288.5 150.2L288.4 150.1L288.6 150L289.2 149.8L289.5 149.7L289.7 149.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M288.4 150.1L288.6 150L289.2 149.8L289.5 149.7L289.7 149.8L295.3 153.6L295.3 153.8M295.3 163.3L295.2 163.4L294.6 163.6L294.3 163.7L294.1 163.6L288.5 159.8L288.4 159.6M295.3 153.8L295.3 163.3M288.4 150.1L288.4 159.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"291.3\" cy=\"152.8\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"57\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.3 168.5L296.5 168.4L297.1 168.1L297.4 168.1L297.6 168.2L303.2 172L303.2 172.1L303.2 181.7L303.1 181.8L302.5 182L302.2 182.1L302 182L296.4 178.1L296.3 178Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M303.2 181.7L303.1 181.8L303.1 172.3L303.2 172.1ZM303.1 181.8L302.5 182L302.5 172.5L303.1 172.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.5 182L302.2 182.1L302.2 172.5L302.5 172.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M302.2 182.1L302 182L302 172.5L302.2 172.5ZM302 182L296.4 178.1L296.4 168.6L302 172.5ZM296.4 178.1L296.3 178L296.3 168.5L296.4 168.6Z\"/><path class=\"iso-top\" d=\"M303.2 172L303.2 172.1L303.1 172.3L302.5 172.5L302.2 172.5L302 172.5L296.4 168.6L296.3 168.5L296.5 168.4L297.1 168.1L297.4 168.1L297.6 168.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M296.3 168.5L296.5 168.4L297.1 168.1L297.4 168.1L297.6 168.2L303.2 172L303.2 172.1M303.2 181.7L303.1 181.8L302.5 182L302.2 182.1L302 182L296.4 178.1L296.3 178M303.2 172.1L303.2 181.7M296.3 168.5L296.3 178\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"299.2\" cy=\"171.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"94\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M272.6 100.4L272.8 100.3L273.4 100L273.7 100L273.9 100.1L279.5 103.9L279.5 104.1L279.5 113.6L279.4 113.7L278.8 113.9L278.5 114L278.3 113.9L272.7 110.1L272.6 109.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.5 113.6L279.4 113.7L279.4 104.2L279.5 104.1ZM279.4 113.7L278.8 113.9L278.8 104.4L279.4 104.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M278.8 113.9L278.5 114L278.5 104.4L278.8 104.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 114L278.3 113.9L278.3 104.4L278.5 104.4ZM278.3 113.9L272.7 110.1L272.7 100.5L278.3 104.4ZM272.7 110.1L272.6 109.9L272.6 100.4L272.7 100.5Z\"/><path class=\"iso-top\" d=\"M279.5 103.9L279.5 104.1L279.4 104.2L278.8 104.4L278.5 104.4L278.3 104.4L272.7 100.5L272.6 100.4L272.8 100.3L273.4 100L273.7 100L273.9 100.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M272.6 100.4L272.8 100.3L273.4 100L273.7 100L273.9 100.1L279.5 103.9L279.5 104.1M279.5 113.6L279.4 113.7L278.8 113.9L278.5 114L278.3 113.9L272.7 110.1L272.6 109.9M279.5 104.1L279.5 113.6M272.6 100.4L272.6 109.9\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"275.5\" cy=\"103.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"48\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 186.9L304.4 186.8L305 186.5L305.3 186.5L305.5 186.6L311.1 190.4L311.1 190.5L311.1 200.1L311 200.2L310.4 200.4L310.1 200.4L309.9 200.4L304.3 196.5L304.2 196.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.1 200.1L311 200.2L311 190.6L311.1 190.5ZM311 200.2L310.4 200.4L310.4 190.9L311 190.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M310.4 200.4L310.1 200.4L310.1 190.9L310.4 190.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M310.1 200.4L309.9 200.4L309.9 190.8L310.1 190.9ZM309.9 200.4L304.3 196.5L304.3 187L309.9 190.8ZM304.3 196.5L304.2 196.4L304.2 186.9L304.3 187Z\"/><path class=\"iso-top\" d=\"M311.1 190.4L311.1 190.5L311 190.6L310.4 190.9L310.1 190.9L309.9 190.8L304.3 187L304.2 186.9L304.4 186.8L305 186.5L305.3 186.5L305.5 186.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M304.2 186.9L304.4 186.8L305 186.5L305.3 186.5L305.5 186.6L311.1 190.4L311.1 190.5M311.1 200.1L311 200.2L310.4 200.4L310.1 200.4L309.9 200.4L304.3 196.5L304.2 196.4M311.1 190.5L311.1 200.1M304.2 186.9L304.2 196.4\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"307.1\" cy=\"189.5\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"85\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.5 118.8L280.7 118.7L281.3 118.4L281.6 118.4L281.8 118.5L287.4 122.3L287.4 122.4L287.4 132L287.3 132.1L286.7 132.3L286.4 132.4L286.2 132.3L280.6 128.4L280.5 128.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.4 132L287.3 132.1L287.3 122.6L287.4 122.4ZM287.3 132.1L286.7 132.3L286.7 122.8L287.3 122.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.7 132.3L286.4 132.4L286.4 122.8L286.7 122.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286.4 132.4L286.2 132.3L286.2 122.8L286.4 122.8ZM286.2 132.3L280.6 128.4L280.6 118.9L286.2 122.8ZM280.6 128.4L280.5 128.3L280.5 118.8L280.6 118.9Z\"/><path class=\"iso-top\" d=\"M287.4 122.3L287.4 122.4L287.3 122.6L286.7 122.8L286.4 122.8L286.2 122.8L280.6 118.9L280.5 118.8L280.7 118.7L281.3 118.4L281.6 118.4L281.8 118.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M280.5 118.8L280.7 118.7L281.3 118.4L281.6 118.4L281.8 118.5L287.4 122.3L287.4 122.4M287.4 132L287.3 132.1L286.7 132.3L286.4 132.4L286.2 132.3L280.6 128.4L280.5 128.3M287.4 122.4L287.4 132M280.5 118.8L280.5 128.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"283.4\" cy=\"121.4\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"39\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M312.1 205.2L312.3 205.1L312.9 204.9L313.2 204.9L313.4 204.9L319 208.8L319 208.9L319 218.4L318.9 218.6L318.3 218.8L318 218.8L317.8 218.7L312.2 214.9L312.1 214.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 218.4L318.9 218.6L318.9 209L319 208.9ZM318.9 218.6L318.3 218.8L318.3 209.3L318.9 209Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M318.3 218.8L318 218.8L318 209.3L318.3 209.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M318 218.8L317.8 218.7L317.8 209.2L318 209.3ZM317.8 218.7L312.2 214.9L312.2 205.4L317.8 209.2ZM312.2 214.9L312.1 214.8L312.1 205.2L312.2 205.4Z\"/><path class=\"iso-top\" d=\"M319 208.8L319 208.9L318.9 209L318.3 209.3L318 209.3L317.8 209.2L312.2 205.4L312.1 205.2L312.3 205.1L312.9 204.9L313.2 204.9L313.4 204.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M312.1 205.2L312.3 205.1L312.9 204.9L313.2 204.9L313.4 204.9L319 208.8L319 208.9M319 218.4L318.9 218.6L318.3 218.8L318 218.8L317.8 218.7L312.2 214.9L312.1 214.8M319 208.9L319 218.4M312.1 205.2L312.1 214.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"315\" cy=\"207.9\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"76\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M288.4 137.2L288.6 137L289.2 136.8L289.5 136.8L289.7 136.8L295.3 140.7L295.3 140.8L295.3 150.4L295.2 150.5L294.6 150.7L294.3 150.7L294.1 150.7L288.5 146.8L288.4 146.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M295.3 150.4L295.2 150.5L295.2 140.9L295.3 140.8ZM295.2 150.5L294.6 150.7L294.6 141.2L295.2 140.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M294.6 150.7L294.3 150.7L294.3 141.2L294.6 141.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 150.7L294.1 150.7L294.1 141.1L294.3 141.2ZM294.1 150.7L288.5 146.8L288.5 137.3L294.1 141.1ZM288.5 146.8L288.4 146.7L288.4 137.2L288.5 137.3Z\"/><path class=\"iso-top\" d=\"M295.3 140.7L295.3 140.8L295.2 140.9L294.6 141.2L294.3 141.2L294.1 141.1L288.5 137.3L288.4 137.2L288.6 137L289.2 136.8L289.5 136.8L289.7 136.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M288.4 137.2L288.6 137L289.2 136.8L289.5 136.8L289.7 136.8L295.3 140.7L295.3 140.8M295.3 150.4L295.2 150.5L294.6 150.7L294.3 150.7L294.1 150.7L288.5 146.8L288.4 146.7M295.3 140.8L295.3 150.4M288.4 137.2L288.4 146.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"291.3\" cy=\"139.8\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"67\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.3 155.5L296.5 155.4L297.1 155.2L297.4 155.2L297.6 155.2L303.2 159.1L303.2 159.2L303.2 168.7L303.1 168.8L302.5 169.1L302.2 169.1L302 169L296.4 165.2L296.3 165.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M303.2 168.7L303.1 168.8L303.1 159.3L303.2 159.2ZM303.1 168.8L302.5 169.1L302.5 159.6L303.1 159.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.5 169.1L302.2 169.1L302.2 159.6L302.5 159.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M302.2 169.1L302 169L302 159.5L302.2 159.6ZM302 169L296.4 165.2L296.4 155.7L302 159.5ZM296.4 165.2L296.3 165.1L296.3 155.5L296.4 155.7Z\"/><path class=\"iso-top\" d=\"M303.2 159.1L303.2 159.2L303.1 159.3L302.5 159.6L302.2 159.6L302 159.5L296.4 155.7L296.3 155.5L296.5 155.4L297.1 155.2L297.4 155.2L297.6 155.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M296.3 155.5L296.5 155.4L297.1 155.2L297.4 155.2L297.6 155.2L303.2 159.1L303.2 159.2M303.2 168.7L303.1 168.8L302.5 169.1L302.2 169.1L302 169L296.4 165.2L296.3 165.1M303.2 159.2L303.2 168.7M296.3 155.5L296.3 165.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"299.2\" cy=\"158.2\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"58\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 173.9L304.4 173.8L305 173.6L305.3 173.5L305.5 173.6L311.1 177.5L311.1 177.6L311.1 187.1L311 187.2L310.4 187.5L310.1 187.5L309.9 187.4L304.3 183.6L304.2 183.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.1 187.1L311 187.2L311 177.7L311.1 177.6ZM311 187.2L310.4 187.5L310.4 177.9L311 177.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M310.4 187.5L310.1 187.5L310.1 178L310.4 177.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M310.1 187.5L309.9 187.4L309.9 177.9L310.1 178ZM309.9 187.4L304.3 183.6L304.3 174.1L309.9 177.9ZM304.3 183.6L304.2 183.5L304.2 173.9L304.3 174.1Z\"/><path class=\"iso-top\" d=\"M311.1 177.5L311.1 177.6L311 177.7L310.4 177.9L310.1 178L309.9 177.9L304.3 174.1L304.2 173.9L304.4 173.8L305 173.6L305.3 173.5L305.5 173.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M304.2 173.9L304.4 173.8L305 173.6L305.3 173.5L305.5 173.6L311.1 177.5L311.1 177.6M311.1 187.1L311 187.2L310.4 187.5L310.1 187.5L309.9 187.4L304.3 183.6L304.2 183.5M311.1 177.6L311.1 187.1M304.2 173.9L304.2 183.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"307.1\" cy=\"176.6\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"95\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.5 105.8L280.7 105.7L281.3 105.5L281.6 105.5L281.8 105.5L287.4 109.4L287.4 109.5L287.4 119L287.3 119.1L286.7 119.4L286.4 119.4L286.2 119.3L280.6 115.5L280.5 115.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.4 119L287.3 119.1L287.3 109.6L287.4 109.5ZM287.3 119.1L286.7 119.4L286.7 109.8L287.3 109.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.7 119.4L286.4 119.4L286.4 109.9L286.7 109.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286.4 119.4L286.2 119.3L286.2 109.8L286.4 109.9ZM286.2 119.3L280.6 115.5L280.6 106L286.2 109.8ZM280.6 115.5L280.5 115.4L280.5 105.8L280.6 106Z\"/><path class=\"iso-top\" d=\"M287.4 109.4L287.4 109.5L287.3 109.6L286.7 109.8L286.4 109.9L286.2 109.8L280.6 106L280.5 105.8L280.7 105.7L281.3 105.5L281.6 105.5L281.8 105.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M280.5 105.8L280.7 105.7L281.3 105.5L281.6 105.5L281.8 105.5L287.4 109.4L287.4 109.5M287.4 119L287.3 119.1L286.7 119.4L286.4 119.4L286.2 119.3L280.6 115.5L280.5 115.4M287.4 109.5L287.4 119M280.5 105.8L280.5 115.4\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"283.4\" cy=\"108.5\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"49\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M312.1 192.3L312.3 192.2L312.9 192L313.2 191.9L313.4 192L319 195.8L319 196L319 205.5L318.9 205.6L318.3 205.8L318 205.9L317.8 205.8L312.2 202L312.1 201.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 205.5L318.9 205.6L318.9 196.1L319 196ZM318.9 205.6L318.3 205.8L318.3 196.3L318.9 196.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M318.3 205.8L318 205.9L318 196.3L318.3 196.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M318 205.9L317.8 205.8L317.8 196.3L318 196.3ZM317.8 205.8L312.2 202L312.2 192.4L317.8 196.3ZM312.2 202L312.1 201.8L312.1 192.3L312.2 192.4Z\"/><path class=\"iso-top\" d=\"M319 195.8L319 196L318.9 196.1L318.3 196.3L318 196.3L317.8 196.3L312.2 192.4L312.1 192.3L312.3 192.2L312.9 192L313.2 191.9L313.4 192Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M312.1 192.3L312.3 192.2L312.9 192L313.2 191.9L313.4 192L319 195.8L319 196M319 205.5L318.9 205.6L318.3 205.8L318 205.9L317.8 205.8L312.2 202L312.1 201.8M319 196L319 205.5M312.1 192.3L312.1 201.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"315\" cy=\"195\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"86\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M288.4 124.2L288.6 124.1L289.2 123.9L289.5 123.8L289.7 123.9L295.3 127.7L295.3 127.9L295.3 137.4L295.2 137.5L294.6 137.8L294.3 137.8L294.1 137.7L288.5 133.9L288.4 133.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M295.3 137.4L295.2 137.5L295.2 128L295.3 127.9ZM295.2 137.5L294.6 137.8L294.6 128.2L295.2 128Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M294.6 137.8L294.3 137.8L294.3 128.3L294.6 128.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 137.8L294.1 137.7L294.1 128.2L294.3 128.3ZM294.1 137.7L288.5 133.9L288.5 124.3L294.1 128.2ZM288.5 133.9L288.4 133.7L288.4 124.2L288.5 124.3Z\"/><path class=\"iso-top\" d=\"M295.3 127.7L295.3 127.9L295.2 128L294.6 128.2L294.3 128.3L294.1 128.2L288.5 124.3L288.4 124.2L288.6 124.1L289.2 123.9L289.5 123.8L289.7 123.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M288.4 124.2L288.6 124.1L289.2 123.9L289.5 123.8L289.7 123.9L295.3 127.7L295.3 127.9M295.3 137.4L295.2 137.5L294.6 137.8L294.3 137.8L294.1 137.7L288.5 133.9L288.4 133.7M295.3 127.9L295.3 137.4M288.4 124.2L288.4 133.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"291.3\" cy=\"126.9\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"77\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.3 142.6L296.5 142.5L297.1 142.2L297.4 142.2L297.6 142.3L303.2 146.1L303.2 146.3L303.2 155.8L303.1 155.9L302.5 156.1L302.2 156.2L302 156.1L296.4 152.3L296.3 152.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M303.2 155.8L303.1 155.9L303.1 146.4L303.2 146.3ZM303.1 155.9L302.5 156.1L302.5 146.6L303.1 146.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.5 156.1L302.2 156.2L302.2 146.6L302.5 146.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M302.2 156.2L302 156.1L302 146.6L302.2 146.6ZM302 156.1L296.4 152.3L296.4 142.7L302 146.6ZM296.4 152.3L296.3 152.1L296.3 142.6L296.4 142.7Z\"/><path class=\"iso-top\" d=\"M303.2 146.1L303.2 146.3L303.1 146.4L302.5 146.6L302.2 146.6L302 146.6L296.4 142.7L296.3 142.6L296.5 142.5L297.1 142.2L297.4 142.2L297.6 142.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M296.3 142.6L296.5 142.5L297.1 142.2L297.4 142.2L297.6 142.3L303.2 146.1L303.2 146.3M303.2 155.8L303.1 155.9L302.5 156.1L302.2 156.2L302 156.1L296.4 152.3L296.3 152.1M303.2 146.3L303.2 155.8M296.3 142.6L296.3 152.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"299.2\" cy=\"145.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"68\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 161L304.4 160.9L305 160.6L305.3 160.6L305.5 160.7L311.1 164.5L311.1 164.6L311.1 174.2L311 174.3L310.4 174.5L310.1 174.6L309.9 174.5L304.3 170.6L304.2 170.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.1 174.2L311 174.3L311 164.8L311.1 164.6ZM311 174.3L310.4 174.5L310.4 165L311 164.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M310.4 174.5L310.1 174.6L310.1 165L310.4 165Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M310.1 174.6L309.9 174.5L309.9 165L310.1 165ZM309.9 174.5L304.3 170.6L304.3 161.1L309.9 165ZM304.3 170.6L304.2 170.5L304.2 161L304.3 161.1Z\"/><path class=\"iso-top\" d=\"M311.1 164.5L311.1 164.6L311 164.8L310.4 165L310.1 165L309.9 165L304.3 161.1L304.2 161L304.4 160.9L305 160.6L305.3 160.6L305.5 160.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M304.2 161L304.4 160.9L305 160.6L305.3 160.6L305.5 160.7L311.1 164.5L311.1 164.6M311.1 174.2L311 174.3L310.4 174.5L310.1 174.6L309.9 174.5L304.3 170.6L304.2 170.5M311.1 164.6L311.1 174.2M304.2 161L304.2 170.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"307.1\" cy=\"163.6\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"59\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M312.1 179.4L312.3 179.2L312.9 179L313.2 179L313.4 179L319 182.9L319 183L319 192.5L318.9 192.7L318.3 192.9L318 192.9L317.8 192.9L312.2 189L312.1 188.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 192.5L318.9 192.7L318.9 183.1L319 183ZM318.9 192.7L318.3 192.9L318.3 183.4L318.9 183.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M318.3 192.9L318 192.9L318 183.4L318.3 183.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M318 192.9L317.8 192.9L317.8 183.3L318 183.4ZM317.8 192.9L312.2 189L312.2 179.5L317.8 183.3ZM312.2 189L312.1 188.9L312.1 179.4L312.2 179.5Z\"/><path class=\"iso-top\" d=\"M319 182.9L319 183L318.9 183.1L318.3 183.4L318 183.4L317.8 183.3L312.2 179.5L312.1 179.4L312.3 179.2L312.9 179L313.2 179L313.4 179Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M312.1 179.4L312.3 179.2L312.9 179L313.2 179L313.4 179L319 182.9L319 183M319 192.5L318.9 192.7L318.3 192.9L318 192.9L317.8 192.9L312.2 189L312.1 188.9M319 183L319 192.5M312.1 179.4L312.1 188.9\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"315\" cy=\"182\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"96\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M288.4 111.3L288.6 111.2L289.2 110.9L289.5 110.9L289.7 111L295.3 114.8L295.3 114.9L295.3 124.5L295.2 124.6L294.6 124.8L294.3 124.8L294.1 124.8L288.5 120.9L288.4 120.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M295.3 124.5L295.2 124.6L295.2 115L295.3 114.9ZM295.2 124.6L294.6 124.8L294.6 115.3L295.2 115Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M294.6 124.8L294.3 124.8L294.3 115.3L294.6 115.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 124.8L294.1 124.8L294.1 115.2L294.3 115.3ZM294.1 124.8L288.5 120.9L288.5 111.4L294.1 115.2ZM288.5 120.9L288.4 120.8L288.4 111.3L288.5 111.4Z\"/><path class=\"iso-top\" d=\"M295.3 114.8L295.3 114.9L295.2 115L294.6 115.3L294.3 115.3L294.1 115.2L288.5 111.4L288.4 111.3L288.6 111.2L289.2 110.9L289.5 110.9L289.7 111Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M288.4 111.3L288.6 111.2L289.2 110.9L289.5 110.9L289.7 111L295.3 114.8L295.3 114.9M295.3 124.5L295.2 124.6L294.6 124.8L294.3 124.8L294.1 124.8L288.5 120.9L288.4 120.8M295.3 114.9L295.3 124.5M288.4 111.3L288.4 120.8\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"291.3\" cy=\"113.9\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"87\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.3 129.7L296.5 129.5L297.1 129.3L297.4 129.3L297.6 129.3L303.2 133.2L303.2 133.3L303.2 142.8L303.1 143L302.5 143.2L302.2 143.2L302 143.2L296.4 139.3L296.3 139.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M303.2 142.8L303.1 143L303.1 133.4L303.2 133.3ZM303.1 143L302.5 143.2L302.5 133.7L303.1 133.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.5 143.2L302.2 143.2L302.2 133.7L302.5 133.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M302.2 143.2L302 143.2L302 133.6L302.2 133.7ZM302 143.2L296.4 139.3L296.4 129.8L302 133.6ZM296.4 139.3L296.3 139.2L296.3 129.7L296.4 129.8Z\"/><path class=\"iso-top\" d=\"M303.2 133.2L303.2 133.3L303.1 133.4L302.5 133.7L302.2 133.7L302 133.6L296.4 129.8L296.3 129.7L296.5 129.5L297.1 129.3L297.4 129.3L297.6 129.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M296.3 129.7L296.5 129.5L297.1 129.3L297.4 129.3L297.6 129.3L303.2 133.2L303.2 133.3M303.2 142.8L303.1 143L302.5 143.2L302.2 143.2L302 143.2L296.4 139.3L296.3 139.2M303.2 133.3L303.2 142.8M296.3 129.7L296.3 139.2\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"299.2\" cy=\"132.3\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"78\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 148L304.4 147.9L305 147.7L305.3 147.7L305.5 147.7L311.1 151.6L311.1 151.7L311.1 161.2L311 161.3L310.4 161.6L310.1 161.6L309.9 161.5L304.3 157.7L304.2 157.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.1 161.2L311 161.3L311 151.8L311.1 151.7ZM311 161.3L310.4 161.6L310.4 152L311 151.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M310.4 161.6L310.1 161.6L310.1 152.1L310.4 152Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M310.1 161.6L309.9 161.5L309.9 152L310.1 152.1ZM309.9 161.5L304.3 157.7L304.3 148.2L309.9 152ZM304.3 157.7L304.2 157.6L304.2 148L304.3 148.2Z\"/><path class=\"iso-top\" d=\"M311.1 151.6L311.1 151.7L311 151.8L310.4 152L310.1 152.1L309.9 152L304.3 148.2L304.2 148L304.4 147.9L305 147.7L305.3 147.7L305.5 147.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M304.2 148L304.4 147.9L305 147.7L305.3 147.7L305.5 147.7L311.1 151.6L311.1 151.7M311.1 161.2L311 161.3L310.4 161.6L310.1 161.6L309.9 161.5L304.3 157.7L304.2 157.6M311.1 151.7L311.1 161.2M304.2 148L304.2 157.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"307.1\" cy=\"150.7\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"69\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M312.1 166.4L312.3 166.3L312.9 166.1L313.2 166L313.4 166.1L319 169.9L319 170.1L319 179.6L318.9 179.7L318.3 180L318 180L317.8 179.9L312.2 176.1L312.1 175.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 179.6L318.9 179.7L318.9 170.2L319 170.1ZM318.9 179.7L318.3 180L318.3 170.4L318.9 170.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M318.3 180L318 180L318 170.5L318.3 170.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M318 180L317.8 179.9L317.8 170.4L318 170.5ZM317.8 179.9L312.2 176.1L312.2 166.5L317.8 170.4ZM312.2 176.1L312.1 175.9L312.1 166.4L312.2 166.5Z\"/><path class=\"iso-top\" d=\"M319 169.9L319 170.1L318.9 170.2L318.3 170.4L318 170.5L317.8 170.4L312.2 166.5L312.1 166.4L312.3 166.3L312.9 166.1L313.2 166L313.4 166.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M312.1 166.4L312.3 166.3L312.9 166.1L313.2 166L313.4 166.1L319 169.9L319 170.1M319 179.6L318.9 179.7L318.3 180L318 180L317.8 179.9L312.2 176.1L312.1 175.9M319 170.1L319 179.6M312.1 166.4L312.1 175.9\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"315\" cy=\"169.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"97\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.3 116.7L296.5 116.6L297.1 116.4L297.4 116.3L297.6 116.4L303.2 120.2L303.2 120.4L303.2 129.9L303.1 130L302.5 130.3L302.2 130.3L302 130.2L296.4 126.4L296.3 126.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M303.2 129.9L303.1 130L303.1 120.5L303.2 120.4ZM303.1 130L302.5 130.3L302.5 120.7L303.1 120.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.5 130.3L302.2 130.3L302.2 120.8L302.5 120.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M302.2 130.3L302 130.2L302 120.7L302.2 120.8ZM302 130.2L296.4 126.4L296.4 116.8L302 120.7ZM296.4 126.4L296.3 126.2L296.3 116.7L296.4 116.8Z\"/><path class=\"iso-top\" d=\"M303.2 120.2L303.2 120.4L303.1 120.5L302.5 120.7L302.2 120.8L302 120.7L296.4 116.8L296.3 116.7L296.5 116.6L297.1 116.4L297.4 116.3L297.6 116.4Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M296.3 116.7L296.5 116.6L297.1 116.4L297.4 116.3L297.6 116.4L303.2 120.2L303.2 120.4M303.2 129.9L303.1 130L302.5 130.3L302.2 130.3L302 130.2L296.4 126.4L296.3 126.2M303.2 120.4L303.2 129.9M296.3 116.7L296.3 126.2\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"299.2\" cy=\"119.4\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"88\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 135.1L304.4 135L305 134.7L305.3 134.7L305.5 134.8L311.1 138.6L311.1 138.7L311.1 148.3L311 148.4L310.4 148.6L310.1 148.7L309.9 148.6L304.3 144.8L304.2 144.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.1 148.3L311 148.4L311 138.9L311.1 138.7ZM311 148.4L310.4 148.6L310.4 139.1L311 138.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M310.4 148.6L310.1 148.7L310.1 139.1L310.4 139.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M310.1 148.7L309.9 148.6L309.9 139.1L310.1 139.1ZM309.9 148.6L304.3 144.8L304.3 135.2L309.9 139.1ZM304.3 144.8L304.2 144.6L304.2 135.1L304.3 135.2Z\"/><path class=\"iso-top\" d=\"M311.1 138.6L311.1 138.7L311 138.9L310.4 139.1L310.1 139.1L309.9 139.1L304.3 135.2L304.2 135.1L304.4 135L305 134.7L305.3 134.7L305.5 134.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M304.2 135.1L304.4 135L305 134.7L305.3 134.7L305.5 134.8L311.1 138.6L311.1 138.7M311.1 148.3L311 148.4L310.4 148.6L310.1 148.7L309.9 148.6L304.3 144.8L304.2 144.6M311.1 138.7L311.1 148.3M304.2 135.1L304.2 144.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"307.1\" cy=\"137.7\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"79\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M312.1 153.5L312.3 153.4L312.9 153.1L313.2 153.1L313.4 153.2L319 157L319 157.1L319 166.7L318.9 166.8L318.3 167L318 167L317.8 167L312.2 163.1L312.1 163Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 166.7L318.9 166.8L318.9 157.2L319 157.1ZM318.9 166.8L318.3 167L318.3 157.5L318.9 157.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M318.3 167L318 167L318 157.5L318.3 157.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M318 167L317.8 167L317.8 157.4L318 157.5ZM317.8 167L312.2 163.1L312.2 153.6L317.8 157.4ZM312.2 163.1L312.1 163L312.1 153.5L312.2 153.6Z\"/><path class=\"iso-top\" d=\"M319 157L319 157.1L318.9 157.2L318.3 157.5L318 157.5L317.8 157.4L312.2 153.6L312.1 153.5L312.3 153.4L312.9 153.1L313.2 153.1L313.4 153.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M312.1 153.5L312.3 153.4L312.9 153.1L313.2 153.1L313.4 153.2L319 157L319 157.1M319 166.7L318.9 166.8L318.3 167L318 167L317.8 167L312.2 163.1L312.1 163M319 157.1L319 166.7M312.1 153.5L312.1 163\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"315\" cy=\"156.1\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"98\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 122.1L304.4 122L305 121.8L305.3 121.8L305.5 121.8L311.1 125.7L311.1 125.8L311.1 135.3L311 135.5L310.4 135.7L310.1 135.7L309.9 135.7L304.3 131.8L304.2 131.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.1 135.3L311 135.5L311 125.9L311.1 125.8ZM311 135.5L310.4 135.7L310.4 126.2L311 125.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M310.4 135.7L310.1 135.7L310.1 126.2L310.4 126.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M310.1 135.7L309.9 135.7L309.9 126.1L310.1 126.2ZM309.9 135.7L304.3 131.8L304.3 122.3L309.9 126.1ZM304.3 131.8L304.2 131.7L304.2 122.1L304.3 122.3Z\"/><path class=\"iso-top\" d=\"M311.1 125.7L311.1 125.8L311 125.9L310.4 126.2L310.1 126.2L309.9 126.1L304.3 122.3L304.2 122.1L304.4 122L305 121.8L305.3 121.8L305.5 121.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M304.2 122.1L304.4 122L305 121.8L305.3 121.8L305.5 121.8L311.1 125.7L311.1 125.8M311.1 135.3L311 135.5L310.4 135.7L310.1 135.7L309.9 135.7L304.3 131.8L304.2 131.7M311.1 125.8L311.1 135.3M304.2 122.1L304.2 131.7\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"307.1\" cy=\"124.8\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"89\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M312.1 140.5L312.3 140.4L312.9 140.2L313.2 140.1L313.4 140.2L319 144.1L319 144.2L319 153.7L318.9 153.8L318.3 154.1L318 154.1L317.8 154L312.2 150.2L312.1 150.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 153.7L318.9 153.8L318.9 144.3L319 144.2ZM318.9 153.8L318.3 154.1L318.3 144.5L318.9 144.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M318.3 154.1L318 154.1L318 144.6L318.3 144.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M318 154.1L317.8 154L317.8 144.5L318 144.6ZM317.8 154L312.2 150.2L312.2 140.7L317.8 144.5ZM312.2 150.2L312.1 150.1L312.1 140.5L312.2 140.7Z\"/><path class=\"iso-top\" d=\"M319 144.1L319 144.2L318.9 144.3L318.3 144.5L318 144.6L317.8 144.5L312.2 140.7L312.1 140.5L312.3 140.4L312.9 140.2L313.2 140.1L313.4 140.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M312.1 140.5L312.3 140.4L312.9 140.2L313.2 140.1L313.4 140.2L319 144.1L319 144.2M319 153.7L318.9 153.8L318.3 154.1L318 154.1L317.8 154L312.2 150.2L312.1 150.1M319 144.2L319 153.7M312.1 140.5L312.1 150.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"315\" cy=\"143.2\" r=\"0.6\"/></g></g><g class=\"bk-tag\" data-slot=\"99\" data-kind=\"free\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M312.1 127.6L312.3 127.5L312.9 127.2L313.2 127.2L313.4 127.3L319 131.1L319 131.2L319 140.8L318.9 140.9L318.3 141.1L318 141.2L317.8 141.1L312.2 137.2L312.1 137.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 140.8L318.9 140.9L318.9 131.4L319 131.2ZM318.9 140.9L318.3 141.1L318.3 131.6L318.9 131.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M318.3 141.1L318 141.2L318 131.6L318.3 131.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M318 141.2L317.8 141.1L317.8 131.6L318 131.6ZM317.8 141.1L312.2 137.2L312.2 127.7L317.8 131.6ZM312.2 137.2L312.1 137.1L312.1 127.6L312.2 127.7Z\"/><path class=\"iso-top\" d=\"M319 131.1L319 131.2L318.9 131.4L318.3 131.6L318 131.6L317.8 131.6L312.2 127.7L312.1 127.6L312.3 127.5L312.9 127.2L313.2 127.2L313.4 127.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M312.1 127.6L312.3 127.5L312.9 127.2L313.2 127.2L313.4 127.3L319 131.1L319 131.2M319 140.8L318.9 140.9L318.3 141.1L318 141.2L317.8 141.1L312.2 137.2L312.1 137.1M319 131.2L319 140.8M312.1 127.6L312.1 137.1\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"315\" cy=\"130.2\" r=\"0.6\"/></g></g></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M266.6 65.3L266.7 63.7L267 62.1L267.6 60.6L268.6 59.1L269.8 57.7L271.3 56.3L273.1 55L275.1 53.8L277.3 52.7L279.7 51.8L282.4 50.9L285.1 50.2L288 49.6L291 49.1L294.1 48.9L297.2 48.7L300.3 48.7L303.5 48.9L306.5 49.2L309.5 49.7L312.4 50.3L315.1 51.1L317.7 51.9L320.1 52.9L322.3 54.1L324.2 55.3L326 56.6L327.4 58L328.6 59.4L329.5 60.9L330 62.5L330.3 64L330.3 66L330.3 67.6L329.9 69.1L329.3 70.7L328.4 72.2L327.1 73.6L325.6 75L323.9 76.3L321.9 77.5L319.6 78.6L317.2 79.5L314.6 80.4L311.8 81.1L308.9 81.7L305.9 82.1L302.8 82.4L299.7 82.6L296.6 82.5L293.5 82.4L290.4 82.1L287.4 81.6L284.6 81L281.8 80.2L279.2 79.3L276.8 78.3L274.7 77.2L272.7 76L271 74.7L269.5 73.3L268.4 71.9L267.5 70.4L266.9 68.8L266.6 67.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M317.2 79.5L314.6 80.4L314.6 78.4L317.2 77.5ZM330.3 66L330.3 67.6L330.3 65.6L330.3 64ZM330.3 67.6L329.9 69.1L329.9 67.1L330.3 65.6ZM329.9 69.1L329.3 70.7L329.3 68.7L329.9 67.1ZM329.3 70.7L328.4 72.2L328.4 70.2L329.3 68.7ZM328.4 72.2L327.1 73.6L327.1 71.6L328.4 70.2ZM327.1 73.6L325.6 75L325.6 73L327.1 71.6ZM325.6 75L323.9 76.3L323.9 74.3L325.6 73ZM323.9 76.3L321.9 77.5L321.9 75.5L323.9 74.3ZM321.9 77.5L319.6 78.6L319.6 76.5L321.9 75.5ZM319.6 78.6L317.2 79.5L317.2 77.5L319.6 76.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M314.6 80.4L311.8 81.1L311.8 79.1L314.6 78.4ZM311.8 81.1L308.9 81.7L308.9 79.7L311.8 79.1ZM308.9 81.7L305.9 82.1L305.9 80.1L308.9 79.7ZM305.9 82.1L302.8 82.4L302.8 80.4L305.9 80.1ZM302.8 82.4L299.7 82.6L299.7 80.6L302.8 80.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M299.7 82.6L296.6 82.5L296.6 80.5L299.7 80.6ZM296.6 82.5L293.5 82.4L293.5 80.4L296.6 80.5ZM293.5 82.4L290.4 82.1L290.4 80.1L293.5 80.4ZM290.4 82.1L287.4 81.6L287.4 79.6L290.4 80.1ZM287.4 81.6L284.6 81L284.6 79L287.4 79.6ZM284.6 81L281.8 80.2L281.8 78.2L284.6 79Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M281.8 80.2L279.2 79.3L279.2 77.3L281.8 78.2ZM279.2 79.3L276.8 78.3L276.8 76.3L279.2 77.3ZM276.8 78.3L274.7 77.2L274.7 75.2L276.8 76.3ZM274.7 77.2L272.7 76L272.7 74L274.7 75.2ZM272.7 76L271 74.7L271 72.7L272.7 74ZM271 74.7L269.5 73.3L269.5 71.3L271 72.7ZM269.5 73.3L268.4 71.9L268.4 69.9L269.5 71.3ZM268.4 71.9L267.5 70.4L267.5 68.4L268.4 69.9ZM267.5 70.4L266.9 68.8L266.9 66.8L267.5 68.4ZM266.9 68.8L266.6 67.3L266.6 65.3L266.9 66.8Z\"/><path class=\"iso-top\" d=\"M317.2 77.5L314.6 78.4L311.8 79.1L308.9 79.7L305.9 80.1L302.8 80.4L299.7 80.6L296.6 80.5L293.5 80.4L290.4 80.1L287.4 79.6L284.6 79L281.8 78.2L279.2 77.3L276.8 76.3L274.7 75.2L272.7 74L271 72.7L269.5 71.3L268.4 69.9L267.5 68.4L266.9 66.8L266.6 65.3L266.7 63.7L267 62.1L267.6 60.6L268.6 59.1L269.8 57.7L271.3 56.3L273.1 55L275.1 53.8L277.3 52.7L279.7 51.8L282.4 50.9L285.1 50.2L288 49.6L291 49.1L294.1 48.9L297.2 48.7L300.3 48.7L303.5 48.9L306.5 49.2L309.5 49.7L312.4 50.3L315.1 51.1L317.7 51.9L320.1 52.9L322.3 54.1L324.2 55.3L326 56.6L327.4 58L328.6 59.4L329.5 60.9L330 62.5L330.3 64L330.3 65.6L329.9 67.1L329.3 68.7L328.4 70.2L327.1 71.6L325.6 73L323.9 74.3L321.9 75.5L319.6 76.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M330.3 64L330.3 65.6L329.9 67.1L329.3 68.7L328.4 70.2L327.1 71.6L325.6 73L323.9 74.3L321.9 75.5L319.6 76.5L317.2 77.5L314.6 78.4L311.8 79.1L308.9 79.7L305.9 80.1L302.8 80.4L299.7 80.6L296.6 80.5L293.5 80.4L290.4 80.1L287.4 79.6L284.6 79L281.8 78.2L279.2 77.3L276.8 76.3L274.7 75.2L272.7 74L271 72.7L269.5 71.3L268.4 69.9L267.5 68.4L266.9 66.8L266.6 65.3\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M266.6 65.3L266.7 63.7L267 62.1L267.6 60.6L268.6 59.1L269.8 57.7L271.3 56.3L273.1 55L275.1 53.8L277.3 52.7L279.7 51.8L282.4 50.9L285.1 50.2L288 49.6L291 49.1L294.1 48.9L297.2 48.7L300.3 48.7L303.5 48.9L306.5 49.2L309.5 49.7L312.4 50.3L315.1 51.1L317.7 51.9L320.1 52.9L322.3 54.1L324.2 55.3L326 56.6L327.4 58L328.6 59.4L329.5 60.9L330 62.5L330.3 64M330.3 66L330.3 67.6L329.9 69.1L329.3 70.7L328.4 72.2L327.1 73.6L325.6 75L323.9 76.3L321.9 77.5L319.6 78.6L317.2 79.5L314.6 80.4L311.8 81.1L308.9 81.7L305.9 82.1L302.8 82.4L299.7 82.6L296.6 82.5L293.5 82.4L290.4 82.1L287.4 81.6L284.6 81L281.8 80.2L279.2 79.3L276.8 78.3L274.7 77.2L272.7 76L271 74.7L269.5 73.3L268.4 71.9L267.5 70.4L266.9 68.8L266.6 67.3M266.6 65.3L266.6 67.3M330.3 64L330.3 66\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M269.5 57.9L269.6 56.6L269.9 55.3L270.4 54.1L271.1 52.9L272 51.7L273.1 50.6L274.5 49.5L276 48.5L277.6 47.6L279.5 46.7L281.4 45.9L283.6 45.2L285.8 44.6L288.1 44.1L290.5 43.7L292.9 43.4L295.4 43.2L298 43.1L300.5 43.2L303 43.3L305.5 43.6L307.9 43.9L310.3 44.4L312.5 44.9L314.7 45.6L316.7 46.4L318.6 47.2L320.3 48.1L321.9 49.1L323.3 50.2L324.5 51.3L325.5 52.4L326.3 53.6L326.9 54.9L327.3 56.1L327.4 57.4L327.4 64.4L327.4 65.6L327.1 66.9L326.6 68.1L325.9 69.4L324.9 70.5L323.8 71.7L322.5 72.7L321 73.8L319.3 74.7L317.5 75.6L315.5 76.4L313.4 77.1L311.2 77.7L308.8 78.2L306.5 78.6L304 78.9L301.5 79L299 79.1L296.4 79.1L293.9 78.9L291.5 78.7L289 78.3L286.7 77.9L284.4 77.3L282.3 76.6L280.2 75.9L278.3 75.1L276.6 74.1L275 73.2L273.6 72.1L272.4 71L271.4 69.8L270.6 68.6L270 67.4L269.7 66.2L269.5 64.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M315.5 76.4L313.4 77.1L313.4 70L315.5 69.3ZM327.4 64.4L327.4 65.6L327.4 58.6L327.4 57.4ZM327.4 65.6L327.1 66.9L327.1 59.9L327.4 58.6ZM327.1 66.9L326.6 68.1L326.6 61.1L327.1 59.9ZM326.6 68.1L325.9 69.4L325.9 62.3L326.6 61.1ZM325.9 69.4L324.9 70.5L324.9 63.5L325.9 62.3ZM324.9 70.5L323.8 71.7L323.8 64.6L324.9 63.5ZM323.8 71.7L322.5 72.7L322.5 65.7L323.8 64.6ZM322.5 72.7L321 73.8L321 66.7L322.5 65.7ZM321 73.8L319.3 74.7L319.3 67.7L321 66.7ZM319.3 74.7L317.5 75.6L317.5 68.5L319.3 67.7ZM317.5 75.6L315.5 76.4L315.5 69.3L317.5 68.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M313.4 77.1L311.2 77.7L311.2 70.6L313.4 70ZM311.2 77.7L308.8 78.2L308.8 71.1L311.2 70.6ZM308.8 78.2L306.5 78.6L306.5 71.5L308.8 71.1ZM306.5 78.6L304 78.9L304 71.8L306.5 71.5ZM304 78.9L301.5 79L301.5 72L304 71.8ZM301.5 79L299 79.1L299 72.1L301.5 72Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M299 79.1L296.4 79.1L296.4 72.1L299 72.1ZM296.4 79.1L293.9 78.9L293.9 71.9L296.4 72.1ZM293.9 78.9L291.5 78.7L291.5 71.7L293.9 71.9ZM291.5 78.7L289 78.3L289 71.3L291.5 71.7ZM289 78.3L286.7 77.9L286.7 70.8L289 71.3ZM286.7 77.9L284.4 77.3L284.4 70.3L286.7 70.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M284.4 77.3L282.3 76.6L282.3 69.6L284.4 70.3ZM282.3 76.6L280.2 75.9L280.2 68.9L282.3 69.6ZM280.2 75.9L278.3 75.1L278.3 68L280.2 68.9ZM278.3 75.1L276.6 74.1L276.6 67.1L278.3 68ZM276.6 74.1L275 73.2L275 66.1L276.6 67.1ZM275 73.2L273.6 72.1L273.6 65.1L275 66.1ZM273.6 72.1L272.4 71L272.4 64L273.6 65.1ZM272.4 71L271.4 69.8L271.4 62.8L272.4 64ZM271.4 69.8L270.6 68.6L270.6 61.6L271.4 62.8ZM270.6 68.6L270 67.4L270 60.4L270.6 61.6ZM270 67.4L269.7 66.2L269.7 59.1L270 60.4ZM269.7 66.2L269.5 64.9L269.5 57.9L269.7 59.1Z\"/><path class=\"iso-top\" d=\"M315.5 69.3L313.4 70L311.2 70.6L308.8 71.1L306.5 71.5L304 71.8L301.5 72L299 72.1L296.4 72.1L293.9 71.9L291.5 71.7L289 71.3L286.7 70.8L284.4 70.3L282.3 69.6L280.2 68.9L278.3 68L276.6 67.1L275 66.1L273.6 65.1L272.4 64L271.4 62.8L270.6 61.6L270 60.4L269.7 59.1L269.5 57.9L269.6 56.6L269.9 55.3L270.4 54.1L271.1 52.9L272 51.7L273.1 50.6L274.5 49.5L276 48.5L277.6 47.6L279.5 46.7L281.4 45.9L283.6 45.2L285.8 44.6L288.1 44.1L290.5 43.7L292.9 43.4L295.4 43.2L298 43.1L300.5 43.2L303 43.3L305.5 43.6L307.9 43.9L310.3 44.4L312.5 44.9L314.7 45.6L316.7 46.4L318.6 47.2L320.3 48.1L321.9 49.1L323.3 50.2L324.5 51.3L325.5 52.4L326.3 53.6L326.9 54.9L327.3 56.1L327.4 57.4L327.4 58.6L327.1 59.9L326.6 61.1L325.9 62.3L324.9 63.5L323.8 64.6L322.5 65.7L321 66.7L319.3 67.7L317.5 68.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M327.4 57.4L327.4 58.6L327.1 59.9L326.6 61.1L325.9 62.3L324.9 63.5L323.8 64.6L322.5 65.7L321 66.7L319.3 67.7L317.5 68.5L315.5 69.3L313.4 70L311.2 70.6L308.8 71.1L306.5 71.5L304 71.8L301.5 72L299 72.1L296.4 72.1L293.9 71.9L291.5 71.7L289 71.3L286.7 70.8L284.4 70.3L282.3 69.6L280.2 68.9L278.3 68L276.6 67.1L275 66.1L273.6 65.1L272.4 64L271.4 62.8L270.6 61.6L270 60.4L269.7 59.1L269.5 57.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M327.4 57.4L326.4 58.6L326.2 59.8L325.7 61L325 62.2L324.1 63.3L323 64.4L321.7 65.5L320.3 66.4L318.6 67.4L316.9 68.2L315 69L312.9 69.6L310.8 70.2L308.5 70.7L306.2 71.1L303.8 71.4L301.4 71.6L299 71.6L296.5 71.6L294.1 71.5L291.7 71.2L289.3 70.9L287.1 70.4L284.9 69.9L282.8 69.2L280.8 68.5L279 67.7L277.3 66.8L275.8 65.9L274.4 64.8L273.3 63.8L272.3 62.6L271.5 61.5L270.9 60.3L270.6 59.1L269.5 57.9\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M269.5 57.9L269.6 56.6L269.9 55.3L270.4 54.1L271.1 52.9L272 51.7L273.1 50.6L274.5 49.5L276 48.5L277.6 47.6L279.5 46.7L281.4 45.9L283.6 45.2L285.8 44.6L288.1 44.1L290.5 43.7L292.9 43.4L295.4 43.2L298 43.1L300.5 43.2L303 43.3L305.5 43.6L307.9 43.9L310.3 44.4L312.5 44.9L314.7 45.6L316.7 46.4L318.6 47.2L320.3 48.1L321.9 49.1L323.3 50.2L324.5 51.3L325.5 52.4L326.3 53.6L326.9 54.9L327.3 56.1L327.4 57.4M327.4 64.4L327.4 65.6L327.1 66.9L326.6 68.1L325.9 69.4L324.9 70.5L323.8 71.7L322.5 72.7L321 73.8L319.3 74.7L317.5 75.6L315.5 76.4L313.4 77.1L311.2 77.7L308.8 78.2L306.5 78.6L304 78.9L301.5 79L299 79.1L296.4 79.1L293.9 78.9L291.5 78.7L289 78.3L286.7 77.9L284.4 77.3L282.3 76.6L280.2 75.9L278.3 75.1L276.6 74.1L275 73.2L273.6 72.1L272.4 71L271.4 69.8L270.6 68.6L270 67.4L269.7 66.2L269.5 64.9M269.5 57.9L269.5 64.9M327.4 57.4L327.4 64.4\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M315.5 72.4L315.5 69.6M313.8 73L313.8 70.2M312.1 73.5L312.1 70.7M310.3 74L310.3 71.1M308.4 74.3L308.4 71.5M306.5 74.6L306.5 71.8M304.5 74.9L304.5 72.1M302.5 75.1L302.5 72.3M300.5 75.2L300.5 72.4M298.5 75.2L298.5 72.4M296.4 75.2L296.4 72.4M294.4 75.1L294.4 72.3M292.4 74.9L292.4 72.1M290.5 74.6L290.5 71.8M288.6 74.3L288.6 71.5M286.7 74L286.7 71.1M284.9 73.5L284.9 70.7M283.1 73L283.1 70.2M281.4 72.4L281.4 69.6M279.9 71.8L279.9 69M278.3 71.1L278.3 68.3M276.9 70.4L276.9 67.6M275.6 69.6L275.6 66.8M274.5 68.8L274.5 66M273.4 68L273.4 65.2M272.4 67.1L272.4 64.3M271.6 66.2L271.6 63.3M270.9 65.2L270.9 62.4M270.4 64.2L270.4 61.4M269.9 63.2L269.9 60.4M327 63.2L327 60.4M326.6 64.2L326.6 61.4M326 65.2L326 62.4M325.3 66.2L325.3 63.3M324.5 67.1L324.5 64.3M323.6 68L323.6 65.2M322.5 68.8L322.5 66M321.3 69.6L321.3 66.8M320 70.4L320 67.6M318.6 71.1L318.6 68.3M317.1 71.8L317.1 69\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M313.9 68.2L312 68.8L309.9 69.4L307.9 69.8L305.7 70.2L303.5 70.5L301.2 70.6L298.9 70.7L296.6 70.7L294.4 70.5L292.1 70.3L289.9 70L287.8 69.6L285.8 69.1L283.8 68.5L282 67.8L280.3 67L278.7 66.2L277.3 65.3L276 64.4L274.9 63.4L274 62.3L273.3 61.2L272.8 60.1L272.4 59L272.3 57.8L272.3 56.7L272.6 55.6L273.1 54.4L273.7 53.4L274.5 52.3L275.6 51.3L276.8 50.3L278.1 49.4L279.6 48.5L281.3 47.7L283.1 47L285 46.4L287 45.8L289.1 45.4L291.3 45L293.5 44.8L295.7 44.6L298 44.5L300.3 44.6L302.6 44.7L304.8 44.9L307 45.2L309.1 45.7L311.2 46.2L313.1 46.8L314.9 47.4L316.7 48.2L318.2 49L319.7 49.9L320.9 50.9L322 51.9L322.9 52.9L323.6 54L324.2 55.1L324.5 56.2L324.7 57.4L324.6 58.5L324.3 59.7L323.9 60.8L323.2 61.9L322.4 62.9L321.4 64L320.2 64.9L318.8 65.9L317.3 66.7L315.6 67.5Z\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M275.6 54.7L274 54.5M276.2 53.6L274.7 53.3M277.1 52.6L275.6 52.2M278.1 51.6L276.7 51.2M280.7 49.8L279.5 49.3M282.3 49L281.2 48.4M284 48.3L283 47.6M285.8 47.6L284.9 47M289.8 46.6L289.2 45.9M291.9 46.3L291.4 45.5M294 46L293.7 45.2M296.2 45.8L296.1 45M300.7 45.8L300.8 45M302.9 46L303.2 45.2M305.1 46.3L305.5 45.5M307.2 46.6L307.8 45.9M311.1 47.6L312 47M313 48.3L314 47.6M314.6 49L315.8 48.4M316.2 49.8L317.4 49.3M318.8 51.6L320.2 51.2M319.9 52.6L321.3 52.2M320.7 53.6L322.2 53.3M321.4 54.7L322.9 54.5M322.1 56.9L323.7 56.8M322.1 58L323.7 58M321.9 59.1L323.5 59.2M321.5 60.2L323.1 60.4M320.2 62.3L321.6 62.6M319.2 63.3L320.6 63.7M318 64.3L319.4 64.7M316.7 65.1L317.9 65.7M313.5 66.7L314.6 67.3M311.8 67.4L312.7 68.1M309.9 68L310.6 68.7M307.9 68.5L308.5 69.2M303.6 69.1L304 69.9M301.4 69.3L301.6 70.1M299.2 69.4L299.3 70.2M297 69.4L296.9 70.2\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M277 55.9L273.5 55.6M280.8 51.2L278 50.2M288.6 47.9L287 46.4M298.5 46.7L298.5 45M308.4 47.9L309.9 46.4M316.1 51.2L318.9 50.2M320 55.9L323.4 55.6M319.2 61L322.5 61.5M313.9 65.3L316.3 66.5M305.2 68L306.3 69.6M295.1 68.4L294.5 70.1\"/><path class=\"iso-line\" data-tone=\"red\" d=\"M305.1 67.8L304.1 67.9L303.1 68L302.1 68.1L301.1 68.2L300.1 68.2L299.1 68.3L298.1 68.3L297.1 68.3L296.1 68.2L295.1 68.1\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M295.9 56.6L296 56.2L296.4 55.9L297 55.6L297.7 55.4L298.5 55.3L299.3 55.4L300 55.6L300.5 55.9L300.9 56.2L301 56.6L301 57.6L300.9 58L300.5 58.4L300 58.6L299.3 58.8L298.5 58.9L297.7 58.8L297 58.6L296.4 58.4L296 58L295.9 57.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M301 57.6L300.9 58L300.9 57L301 56.6ZM300.9 58L300.5 58.4L300.5 57.4L300.9 57ZM300.5 58.4L300 58.6L300 57.6L300.5 57.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M300 58.6L299.3 58.8L299.3 57.8L300 57.6ZM299.3 58.8L298.5 58.9L298.5 57.9L299.3 57.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M298.5 58.9L297.7 58.8L297.7 57.8L298.5 57.9ZM297.7 58.8L297 58.6L297 57.6L297.7 57.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M297 58.6L296.4 58.4L296.4 57.4L297 57.6ZM296.4 58.4L296 58L296 57L296.4 57.4ZM296 58L295.9 57.6L295.9 56.6L296 57Z\"/><path class=\"iso-top\" d=\"M300 57.6L299.3 57.8L298.5 57.9L297.7 57.8L297 57.6L296.4 57.4L296 57L295.9 56.6L296 56.2L296.4 55.9L297 55.6L297.7 55.4L298.5 55.3L299.3 55.4L300 55.6L300.5 55.9L300.9 56.2L301 56.6L300.9 57L300.5 57.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M301 56.6L300.9 57L300.5 57.4L300 57.6L299.3 57.8L298.5 57.9L297.7 57.8L297 57.6L296.4 57.4L296 57L295.9 56.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M295.9 56.6L296 56.2L296.4 55.9L297 55.6L297.7 55.4L298.5 55.3L299.3 55.4L300 55.6L300.5 55.9L300.9 56.2L301 56.6M301 57.6L300.9 58L300.5 58.4L300 58.6L299.3 58.8L298.5 58.9L297.7 58.8L297 58.6L296.4 58.4L296 58L295.9 57.6M295.9 56.6L295.9 57.6M301 56.6L301 57.6\"/></g><text class=\"iso-face-text\" data-tone=\"lo\" transform=\"matrix(0.681 0.469 -0.937 0.341 289.096 61.02)\" font-size=\"2.4\" text-anchor=\"middle\">SYN_RECV %</text><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M320.6 91.8L320.8 90.5L321.4 89.1L322.5 87.9L323.9 86.7L325.7 85.7L327.8 84.8L330.1 84.1L332.6 83.6L335.2 83.2L338 83.1L340.7 83.2L343.3 83.6L345.9 84.1L348.2 84.8L350.3 85.7L352 86.7L353.5 87.9L354.5 89.1L355.1 90.5L355.3 91.8L355.3 93.8L355.1 95.2L354.5 96.5L353.5 97.8L352 98.9L350.3 100L348.2 100.9L345.9 101.6L343.3 102.1L340.7 102.4L338 102.5L335.2 102.4L332.6 102.1L330.1 101.6L327.8 100.9L325.7 100L323.9 98.9L322.5 97.8L321.4 96.5L320.8 95.2L320.6 93.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M348.2 100.9L345.9 101.6L345.9 99.6L348.2 98.9ZM355.3 93.8L355.1 95.2L355.1 93.2L355.3 91.8ZM355.1 95.2L354.5 96.5L354.5 94.5L355.1 93.2ZM354.5 96.5L353.5 97.8L353.5 95.8L354.5 94.5ZM353.5 97.8L352 98.9L352 96.9L353.5 95.8ZM352 98.9L350.3 100L350.3 98L352 96.9ZM350.3 100L348.2 100.9L348.2 98.9L350.3 98Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M345.9 101.6L343.3 102.1L343.3 100.1L345.9 99.6ZM343.3 102.1L340.7 102.4L340.7 100.4L343.3 100.1ZM340.7 102.4L338 102.5L338 100.5L340.7 100.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M338 102.5L335.2 102.4L335.2 100.4L338 100.5ZM335.2 102.4L332.6 102.1L332.6 100.1L335.2 100.4ZM332.6 102.1L330.1 101.6L330.1 99.6L332.6 100.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M330.1 101.6L327.8 100.9L327.8 98.9L330.1 99.6ZM327.8 100.9L325.7 100L325.7 98L327.8 98.9ZM325.7 100L323.9 98.9L323.9 96.9L325.7 98ZM323.9 98.9L322.5 97.8L322.5 95.8L323.9 96.9ZM322.5 97.8L321.4 96.5L321.4 94.5L322.5 95.8ZM321.4 96.5L320.8 95.2L320.8 93.2L321.4 94.5ZM320.8 95.2L320.6 93.8L320.6 91.8L320.8 93.2Z\"/><path class=\"iso-top\" d=\"M348.2 98.9L345.9 99.6L343.3 100.1L340.7 100.4L338 100.5L335.2 100.4L332.6 100.1L330.1 99.6L327.8 98.9L325.7 98L323.9 96.9L322.5 95.8L321.4 94.5L320.8 93.2L320.6 91.8L320.8 90.5L321.4 89.1L322.5 87.9L323.9 86.7L325.7 85.7L327.8 84.8L330.1 84.1L332.6 83.6L335.2 83.2L338 83.1L340.7 83.2L343.3 83.6L345.9 84.1L348.2 84.8L350.3 85.7L352 86.7L353.5 87.9L354.5 89.1L355.1 90.5L355.3 91.8L355.1 93.2L354.5 94.5L353.5 95.8L352 96.9L350.3 98Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M355.3 91.8L355.1 93.2L354.5 94.5L353.5 95.8L352 96.9L350.3 98L348.2 98.9L345.9 99.6L343.3 100.1L340.7 100.4L338 100.5L335.2 100.4L332.6 100.1L330.1 99.6L327.8 98.9L325.7 98L323.9 96.9L322.5 95.8L321.4 94.5L320.8 93.2L320.6 91.8\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M320.6 91.8L320.8 90.5L321.4 89.1L322.5 87.9L323.9 86.7L325.7 85.7L327.8 84.8L330.1 84.1L332.6 83.6L335.2 83.2L338 83.1L340.7 83.2L343.3 83.6L345.9 84.1L348.2 84.8L350.3 85.7L352 86.7L353.5 87.9L354.5 89.1L355.1 90.5L355.3 91.8M355.3 93.8L355.1 95.2L354.5 96.5L353.5 97.8L352 98.9L350.3 100L348.2 100.9L345.9 101.6L343.3 102.1L340.7 102.4L338 102.5L335.2 102.4L332.6 102.1L330.1 101.6L327.8 100.9L325.7 100L323.9 98.9L322.5 97.8L321.4 96.5L320.8 95.2L320.6 93.8M320.6 91.8L320.6 93.8M355.3 91.8L355.3 93.8\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M322.9 85.6L323.1 84.6L323.5 83.7L324.2 82.7L325.1 81.9L326.3 81.1L327.6 80.3L329.1 79.7L330.8 79.2L332.6 78.8L334.5 78.5L336.4 78.3L338.4 78.3L340.3 78.4L342.2 78.6L344.1 78.9L345.8 79.4L347.4 79.9L348.9 80.6L350.2 81.4L351.2 82.2L352 83.1L352.6 84L352.9 85L353 86L353 92L352.8 93L352.4 94L351.7 94.9L350.8 95.8L349.7 96.6L348.3 97.3L346.8 97.9L345.2 98.4L343.4 98.9L341.5 99.1L339.5 99.3L337.6 99.3L335.6 99.3L333.7 99L331.8 98.7L330.1 98.2L328.5 97.7L327 97L325.8 96.2L324.7 95.4L323.9 94.5L323.3 93.6L323 92.6L322.9 91.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M346.8 97.9L345.2 98.4L345.2 92.4L346.8 91.9ZM353 92L352.8 93L352.8 87L353 86ZM352.8 93L352.4 94L352.4 87.9L352.8 87ZM352.4 94L351.7 94.9L351.7 88.9L352.4 87.9ZM351.7 94.9L350.8 95.8L350.8 89.7L351.7 88.9ZM350.8 95.8L349.7 96.6L349.7 90.5L350.8 89.7ZM349.7 96.6L348.3 97.3L348.3 91.3L349.7 90.5ZM348.3 97.3L346.8 97.9L346.8 91.9L348.3 91.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M345.2 98.4L343.4 98.9L343.4 92.8L345.2 92.4ZM343.4 98.9L341.5 99.1L341.5 93.1L343.4 92.8ZM341.5 99.1L339.5 99.3L339.5 93.3L341.5 93.1ZM339.5 99.3L337.6 99.3L337.6 93.3L339.5 93.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M337.6 99.3L335.6 99.3L335.6 93.2L337.6 93.3ZM335.6 99.3L333.7 99L333.7 93L335.6 93.2ZM333.7 99L331.8 98.7L331.8 92.7L333.7 93ZM331.8 98.7L330.1 98.2L330.1 92.2L331.8 92.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M330.1 98.2L328.5 97.7L328.5 91.7L330.1 92.2ZM328.5 97.7L327 97L327 91L328.5 91.7ZM327 97L325.8 96.2L325.8 90.2L327 91ZM325.8 96.2L324.7 95.4L324.7 89.4L325.8 90.2ZM324.7 95.4L323.9 94.5L323.9 88.5L324.7 89.4ZM323.9 94.5L323.3 93.6L323.3 87.6L323.9 88.5ZM323.3 93.6L323 92.6L323 86.6L323.3 87.6ZM323 92.6L322.9 91.6L322.9 85.6L323 86.6Z\"/><path class=\"iso-top\" d=\"M346.8 91.9L345.2 92.4L343.4 92.8L341.5 93.1L339.5 93.3L337.6 93.3L335.6 93.2L333.7 93L331.8 92.7L330.1 92.2L328.5 91.7L327 91L325.8 90.2L324.7 89.4L323.9 88.5L323.3 87.6L323 86.6L322.9 85.6L323.1 84.6L323.5 83.7L324.2 82.7L325.1 81.9L326.3 81.1L327.6 80.3L329.1 79.7L330.8 79.2L332.6 78.8L334.5 78.5L336.4 78.3L338.4 78.3L340.3 78.4L342.2 78.6L344.1 78.9L345.8 79.4L347.4 79.9L348.9 80.6L350.2 81.4L351.2 82.2L352 83.1L352.6 84L352.9 85L353 86L352.8 87L352.4 87.9L351.7 88.9L350.8 89.7L349.7 90.5L348.3 91.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M353 86L352.8 87L352.4 87.9L351.7 88.9L350.8 89.7L349.7 90.5L348.3 91.3L346.8 91.9L345.2 92.4L343.4 92.8L341.5 93.1L339.5 93.3L337.6 93.3L335.6 93.2L333.7 93L331.8 92.7L330.1 92.2L328.5 91.7L327 91L325.8 90.2L324.7 89.4L323.9 88.5L323.3 87.6L323 86.6L322.9 85.6\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M353 86L352.2 86.9L351.7 87.8L351.1 88.7L350.2 89.6L349.1 90.3L347.9 91L346.4 91.6L344.8 92.1L343.1 92.5L341.3 92.8L339.5 92.9L337.6 93L335.7 92.9L333.9 92.7L332.1 92.4L330.5 91.9L328.9 91.4L327.5 90.7L326.3 90L325.3 89.2L324.6 88.4L324 87.5L323.7 86.6L322.9 85.6\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M322.9 85.6L323.1 84.6L323.5 83.7L324.2 82.7L325.1 81.9L326.3 81.1L327.6 80.3L329.1 79.7L330.8 79.2L332.6 78.8L334.5 78.5L336.4 78.3L338.4 78.3L340.3 78.4L342.2 78.6L344.1 78.9L345.8 79.4L347.4 79.9L348.9 80.6L350.2 81.4L351.2 82.2L352 83.1L352.6 84L352.9 85L353 86M353 92L352.8 93L352.4 94L351.7 94.9L350.8 95.8L349.7 96.6L348.3 97.3L346.8 97.9L345.2 98.4L343.4 98.9L341.5 99.1L339.5 99.3L337.6 99.3L335.6 99.3L333.7 99L331.8 98.7L330.1 98.2L328.5 97.7L327 97L325.8 96.2L324.7 95.4L323.9 94.5L323.3 93.6L323 92.6L322.9 91.6M322.9 85.6L322.9 91.6M353 86L353 92\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M346.8 94.2L346.8 92.2M345.2 94.7L345.2 92.7M343.4 95.1L343.4 93.1M341.5 95.4L341.5 93.4M339.5 95.6L339.5 93.6M337.6 95.6L337.6 93.6M335.6 95.5L335.6 93.5M333.7 95.3L333.7 93.3M331.8 95L331.8 93M330.1 94.5L330.1 92.5M328.5 94L328.5 92M327 93.3L327 91.3M325.8 92.5L325.8 90.5M324.7 91.7L324.7 89.7M323.9 90.8L323.9 88.8M323.3 89.9L323.3 87.9M352.8 89.3L352.8 87.3M352.4 90.2L352.4 88.2M351.7 91.2L351.7 89.2M350.8 92L350.8 90M349.7 92.8L349.7 90.8M348.3 93.6L348.3 91.6\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M348.6 83.4L349.6 83.2M349.3 84.6L350.4 84.5M349.6 85.8L350.7 85.8M349.3 87L350.4 87.1M347.3 89.2L348.3 89.5M345.7 90.1L346.5 90.5M343.8 90.8L344.3 91.3M341.5 91.3L341.9 91.9M336.8 91.6L336.6 92.1M334.4 91.3L334 91.9M332.2 90.8L331.6 91.3M330.2 90.1L329.4 90.5M327.4 88.2L326.3 88.4M326.6 87L325.5 87.1M326.4 85.8L325.2 85.8M326.6 84.6L325.5 84.5M328.6 82.4L327.7 82.1M330.2 81.5L329.4 81.1M332.2 80.8L331.6 80.3M334.4 80.3L334 79.7M339.2 80L339.3 79.5M341.5 80.3L341.9 79.7M343.8 80.8L344.3 80.3M345.7 81.5L346.5 81.1\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M346.2 82.8L348.3 82.1M347.3 87.9L349.6 88.4M339 90.9L339.3 92.1M329.7 88.8L327.7 89.5M328.7 83.7L326.3 83.2M336.9 80.7L336.6 79.5\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M336.1 84.9L336.4 84.5L336.9 84.2L337.5 84.1L338.3 84.1L338.9 84.2L339.5 84.5L339.8 84.8L339.8 85.1L339.8 85.9L339.5 86.3L339.1 86.6L338.4 86.7L337.7 86.7L337 86.6L336.5 86.3L336.2 86L336.1 85.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M339.8 85.9L339.5 86.3L339.5 85.5L339.8 85.1ZM339.5 86.3L339.1 86.6L339.1 85.7L339.5 85.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M339.1 86.6L338.4 86.7L338.4 85.9L339.1 85.7ZM338.4 86.7L337.7 86.7L337.7 85.9L338.4 85.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M337.7 86.7L337 86.6L337 85.8L337.7 85.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M337 86.6L336.5 86.3L336.5 85.5L337 85.8ZM336.5 86.3L336.2 86L336.2 85.2L336.5 85.5ZM336.2 86L336.1 85.7L336.1 84.9L336.2 85.2Z\"/><path class=\"iso-top\" d=\"M339.1 85.7L338.4 85.9L337.7 85.9L337 85.8L336.5 85.5L336.2 85.2L336.1 84.9L336.4 84.5L336.9 84.2L337.5 84.1L338.3 84.1L338.9 84.2L339.5 84.5L339.8 84.8L339.8 85.1L339.5 85.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M339.8 85.1L339.5 85.5L339.1 85.7L338.4 85.9L337.7 85.9L337 85.8L336.5 85.5L336.2 85.2L336.1 84.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M336.1 84.9L336.4 84.5L336.9 84.2L337.5 84.1L338.3 84.1L338.9 84.2L339.5 84.5L339.8 84.8L339.8 85.1M339.8 85.9L339.5 86.3L339.1 86.6L338.4 86.7L337.7 86.7L337 86.6L336.5 86.3L336.2 86L336.1 85.7M336.1 84.9L336.1 85.7M339.8 85.1L339.8 85.9\"/></g><g data-part=\"gauge-needle\"><path class=\"iso-line bk-needle\" data-tone=\"lit\" data-free=\"start\" d=\"\"/></g><g data-part=\"timer-hand\"><path class=\"iso-line bk-hand\" data-tone=\"hi\" data-free=\"start\" d=\"\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M443 286.9L443.2 286.3L444 285.9L455.2 281.8L456.4 281.6L457.5 281.7L458.5 282.1L472.1 291.4L472.5 292L472.5 296L472.3 296.6L471.6 297.1L460.3 301.1L459.2 301.4L458 301.3L457.1 300.9L443.5 291.5L443 291Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M472.5 296L472.3 296.6L472.3 292.6L472.5 292ZM472.3 296.6L471.6 297.1L471.6 293L472.3 292.6ZM471.6 297.1L460.3 301.1L460.3 297.1L471.6 293Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M460.3 301.1L459.2 301.4L459.2 297.3L460.3 297.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M459.2 301.4L458 301.3L458 297.3L459.2 297.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M458 301.3L457.1 300.9L457.1 296.9L458 297.3ZM457.1 300.9L443.5 291.5L443.5 287.5L457.1 296.9ZM443.5 291.5L443 291L443 286.9L443.5 287.5Z\"/><path class=\"iso-top\" d=\"M472.1 291.4L472.5 292L472.3 292.6L471.6 293L460.3 297.1L459.2 297.3L458 297.3L457.1 296.9L443.5 287.5L443 286.9L443.2 286.3L444 285.9L455.2 281.8L456.4 281.6L457.5 281.7L458.5 282.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M472.5 292L472.3 292.6L471.6 293L460.3 297.1L459.2 297.3L458 297.3L457.1 296.9L443.5 287.5L443 286.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M472.5 292L471.7 292.4L471.1 292.8L460 296.8L459.1 297L458.3 296.9L457.6 296.6L444.1 287.3L443 286.9\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M443 286.9L443.2 286.3L444 285.9L455.2 281.8L456.4 281.6L457.5 281.7L458.5 282.1L472.1 291.4L472.5 292M472.5 296L472.3 296.6L471.6 297.1L460.3 301.1L459.2 301.4L458 301.3L457.1 300.9L443.5 291.5L443 291M472.5 292L472.5 296M443 286.9L443 291\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M449.5 206.1L449.9 205.7L456.5 203.4L457.4 203.3L458.1 203.5L464.9 208.2L465.1 208.6L465.1 290.9L464.7 291.3L458.1 293.6L457.3 293.7L456.5 293.5L449.7 288.8L449.5 288.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M465.1 290.9L464.7 291.3L464.7 209L465.1 208.6ZM464.7 291.3L458.1 293.6L458.1 211.4L464.7 209Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M458.1 293.6L457.3 293.7L457.3 211.5L458.1 211.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M457.3 293.7L456.5 293.5L456.5 211.2L457.3 211.5ZM456.5 293.5L449.7 288.8L449.7 206.5L456.5 211.2ZM449.7 288.8L449.5 288.4L449.5 206.1L449.7 206.5Z\"/><path class=\"iso-top\" d=\"M464.9 208.2L465.1 208.6L464.7 209L458.1 211.4L457.3 211.5L456.5 211.2L449.7 206.5L449.5 206.1L449.9 205.7L456.5 203.4L457.4 203.3L458.1 203.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M465.1 208.6L464.7 209L458.1 211.4L457.3 211.5L456.5 211.2L449.7 206.5L449.5 206.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M465.1 208.6L464.3 208.8L457.9 211.1L457.3 211.2L456.9 211L450.2 206.4L449.5 206.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M449.5 206.1L449.9 205.7L456.5 203.4L457.4 203.3L458.1 203.5L464.9 208.2L465.1 208.6M465.1 290.9L464.7 291.3L458.1 293.6L457.3 293.7L456.5 293.5L449.7 288.8L449.5 288.4M465.1 208.6L465.1 290.9M449.5 206.1L449.5 288.4\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"447.9\" cy=\"286.6\" r=\"0.45\"/><circle cx=\"460.2\" cy=\"295\" r=\"0.45\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M513.7 251.3L514 251.1L516.6 250.1L517.1 250L517.6 250.2L520.9 252.4L521 252.7L521 308.9L520.7 309.1L518.1 310.1L517.6 310.1L517.1 310L513.9 307.7L513.7 307.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M521 308.9L520.7 309.1L520.7 252.9L521 252.7ZM520.7 309.1L518.1 310.1L518.1 253.9L520.7 252.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M518.1 310.1L517.6 310.1L517.6 253.9L518.1 253.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M517.6 310.1L517.1 310L517.1 253.8L517.6 253.9ZM517.1 310L513.9 307.7L513.9 251.5L517.1 253.8ZM513.9 307.7L513.7 307.5L513.7 251.3L513.9 251.5Z\"/><path class=\"iso-top\" d=\"M520.9 252.4L521 252.7L520.7 252.9L518.1 253.9L517.6 253.9L517.1 253.8L513.9 251.5L513.7 251.3L514 251.1L516.6 250.1L517.1 250L517.6 250.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M521 252.7L520.7 252.9L518.1 253.9L517.6 253.9L517.1 253.8L513.9 251.5L513.7 251.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M521 252.7L520.4 252.8L517.9 253.7L517.6 253.7L517.4 253.6L514.3 251.4L513.7 251.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M513.7 251.3L514 251.1L516.6 250.1L517.1 250L517.6 250.2L520.9 252.4L521 252.7M521 308.9L520.7 309.1L518.1 310.1L517.6 310.1L517.1 310L513.9 307.7L513.7 307.5M521 252.7L521 308.9M513.7 251.3L513.7 307.5\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"515.5\" cy=\"304.8\" r=\"0.45\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M479.7 229.9L480 229.6L482.6 228.7L483.1 228.6L483.6 228.8L486.8 231L486.9 231.3L486.9 285.4L486.7 285.7L484 286.6L483.5 286.7L483.1 286.5L479.8 284.3L479.7 284Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M486.9 285.4L486.7 285.7L486.7 231.5L486.9 231.3ZM486.7 285.7L484 286.6L484 232.4L486.7 231.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M484 286.6L483.5 286.7L483.5 232.5L484 232.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M483.5 286.7L483.1 286.5L483.1 232.4L483.5 232.5ZM483.1 286.5L479.8 284.3L479.8 230.1L483.1 232.4ZM479.8 284.3L479.7 284L479.7 229.9L479.8 230.1Z\"/><path class=\"iso-top\" d=\"M486.8 231L486.9 231.3L486.7 231.5L484 232.4L483.5 232.5L483.1 232.4L479.8 230.1L479.7 229.9L480 229.6L482.6 228.7L483.1 228.6L483.6 228.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M486.9 231.3L486.7 231.5L484 232.4L483.5 232.5L483.1 232.4L479.8 230.1L479.7 229.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M486.9 231.3L486.3 231.3L483.8 232.2L483.6 232.3L483.4 232.2L480.2 230L479.7 229.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M479.7 229.9L480 229.6L482.6 228.7L483.1 228.6L483.6 228.8L486.8 231L486.9 231.3M486.9 285.4L486.7 285.7L484 286.6L483.5 286.7L483.1 286.5L479.8 284.3L479.7 284M486.9 231.3L486.9 285.4M479.7 229.9L479.7 284\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"481.4\" cy=\"281.4\" r=\"0.45\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M538.2 284.1L538.4 283.9L540.1 283.3L540.6 283.2L541.1 283.3L542.3 284.2L542.4 284.4L542.4 318.6L542.2 318.8L540.5 319.4L540 319.5L539.5 319.3L538.3 318.5L538.2 318.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M542.4 318.6L542.2 318.8L542.2 284.7L542.4 284.4ZM542.2 318.8L540.5 319.4L540.5 285.3L542.2 284.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M540.5 319.4L540 319.5L540 285.3L540.5 285.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M540 319.5L539.5 319.3L539.5 285.2L540 285.3ZM539.5 319.3L538.3 318.5L538.3 284.4L539.5 285.2ZM538.3 318.5L538.2 318.2L538.2 284.1L538.3 284.4Z\"/><path class=\"iso-top\" d=\"M542.3 284.2L542.4 284.4L542.2 284.7L540.5 285.3L540 285.3L539.5 285.2L538.3 284.4L538.2 284.1L538.4 283.9L540.1 283.3L540.6 283.2L541.1 283.3Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M538.2 284.1L538.4 283.9L540.1 283.3L540.6 283.2L541.1 283.3L542.3 284.2L542.4 284.4M542.4 318.6L542.2 318.8L540.5 319.4L540 319.5L539.5 319.3L538.3 318.5L538.2 318.2M542.4 284.4L542.4 318.6M538.2 284.1L538.2 318.2\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M553.8 294.9L554.1 294.6L555.8 294L556.3 294L556.8 294.1L558 295L558.1 295.2L558.1 329.3L557.8 329.6L556.1 330.2L555.6 330.2L555.2 330.1L553.9 329.3L553.8 329Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M558.1 329.3L557.8 329.6L557.8 295.4L558.1 295.2ZM557.8 329.6L556.1 330.2L556.1 296.1L557.8 295.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M556.1 330.2L555.6 330.2L555.6 296.1L556.1 296.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M555.6 330.2L555.2 330.1L555.2 296L555.6 296.1ZM555.2 330.1L553.9 329.3L553.9 295.1L555.2 296ZM553.9 329.3L553.8 329L553.8 294.9L553.9 295.1Z\"/><path class=\"iso-top\" d=\"M558 295L558.1 295.2L557.8 295.4L556.1 296.1L555.6 296.1L555.2 296L553.9 295.1L553.8 294.9L554.1 294.6L555.8 294L556.3 294L556.8 294.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M553.8 294.9L554.1 294.6L555.8 294L556.3 294L556.8 294.1L558 295L558.1 295.2M558.1 329.3L557.8 329.6L556.1 330.2L555.6 330.2L555.2 330.1L553.9 329.3L553.8 329M558.1 295.2L558.1 329.3M553.8 294.9L553.8 329\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M398.7 229.2L399.1 228.9L402.3 227.7L403 227.7L403.6 227.8L405.9 229.4L406.1 229.8L406.1 270.9L405.7 271.2L402.5 272.4L401.8 272.5L401.2 272.3L398.9 270.7L398.7 270.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M406.1 270.9L405.7 271.2L405.7 230.1L406.1 229.8ZM405.7 271.2L402.5 272.4L402.5 231.2L405.7 230.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M402.5 272.4L401.8 272.5L401.8 231.3L402.5 231.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M401.8 272.5L401.2 272.3L401.2 231.1L401.8 231.3ZM401.2 272.3L398.9 270.7L398.9 229.6L401.2 231.1ZM398.9 270.7L398.7 270.3L398.7 229.2L398.9 229.6Z\"/><path class=\"iso-top\" d=\"M405.9 229.4L406.1 229.8L405.7 230.1L402.5 231.2L401.8 231.3L401.2 231.1L398.9 229.6L398.7 229.2L399.1 228.9L402.3 227.7L403 227.7L403.6 227.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M398.7 229.2L399.1 228.9L402.3 227.7L403 227.7L403.6 227.8L405.9 229.4L406.1 229.8M406.1 270.9L405.7 271.2L402.5 272.4L401.8 272.5L401.2 272.3L398.9 270.7L398.7 270.3M406.1 229.8L406.1 270.9M398.7 229.2L398.7 270.3\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M395 268.7L395.1 268.2L395.7 267.9L402.3 265.5L403.1 265.3L404 265.4L404.7 265.7L409.5 269L409.8 269.4L409.8 271L409.6 271.4L409.1 271.8L402.5 274.2L401.7 274.3L400.8 274.3L400.1 274L395.3 270.7L395 270.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M409.8 271L409.6 271.4L409.6 269.8L409.8 269.4ZM409.6 271.4L409.1 271.8L409.1 270.2L409.6 269.8ZM409.1 271.8L402.5 274.2L402.5 272.6L409.1 270.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M402.5 274.2L401.7 274.3L401.7 272.7L402.5 272.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M401.7 274.3L400.8 274.3L400.8 272.7L401.7 272.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M400.8 274.3L400.1 274L400.1 272.4L400.8 272.7ZM400.1 274L395.3 270.7L395.3 269.1L400.1 272.4ZM395.3 270.7L395 270.3L395 268.7L395.3 269.1Z\"/><path class=\"iso-top\" d=\"M409.5 269L409.8 269.4L409.6 269.8L409.1 270.2L402.5 272.6L401.7 272.7L400.8 272.7L400.1 272.4L395.3 269.1L395 268.7L395.1 268.2L395.7 267.9L402.3 265.5L403.1 265.3L404 265.4L404.7 265.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M409.8 269.4L409.6 269.8L409.1 270.2L402.5 272.6L401.7 272.7L400.8 272.7L400.1 272.4L395.3 269.1L395 268.7\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M395 268.7L395.1 268.2L395.7 267.9L402.3 265.5L403.1 265.3L404 265.4L404.7 265.7L409.5 269L409.8 269.4M409.8 271L409.6 271.4L409.1 271.8L402.5 274.2L401.7 274.3L400.8 274.3L400.1 274L395.3 270.7L395 270.3M409.8 269.4L409.8 271M395 268.7L395 270.3\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M551.3 334.2L551.6 333.9L554.8 332.7L555.5 332.6L556.1 332.8L558.4 334.4L558.6 334.8L558.6 375.9L558.2 376.2L555 377.4L554.4 377.5L553.8 377.3L551.4 375.7L551.3 375.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M558.6 375.9L558.2 376.2L558.2 335.1L558.6 334.8ZM558.2 376.2L555 377.4L555 336.2L558.2 335.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M555 377.4L554.4 377.5L554.4 336.3L555 336.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M554.4 377.5L553.8 377.3L553.8 336.1L554.4 336.3ZM553.8 377.3L551.4 375.7L551.4 334.5L553.8 336.1ZM551.4 375.7L551.3 375.3L551.3 334.2L551.4 334.5Z\"/><path class=\"iso-top\" d=\"M558.4 334.4L558.6 334.8L558.2 335.1L555 336.2L554.4 336.3L553.8 336.1L551.4 334.5L551.3 334.2L551.6 333.9L554.8 332.7L555.5 332.6L556.1 332.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M551.3 334.2L551.6 333.9L554.8 332.7L555.5 332.6L556.1 332.8L558.4 334.4L558.6 334.8M558.6 375.9L558.2 376.2L555 377.4L554.4 377.5L553.8 377.3L551.4 375.7L551.3 375.3M558.6 334.8L558.6 375.9M551.3 334.2L551.3 375.3\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M547.5 373.7L547.7 373.2L548.3 372.9L554.8 370.5L555.7 370.3L556.5 370.4L557.2 370.7L562 373.9L562.3 374.4L562.3 376L562.2 376.4L561.6 376.8L555.1 379.2L554.2 379.3L553.3 379.2L552.6 379L547.9 375.7L547.5 375.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M562.3 376L562.2 376.4L562.2 374.8L562.3 374.4ZM562.2 376.4L561.6 376.8L561.6 375.2L562.2 374.8ZM561.6 376.8L555.1 379.2L555.1 377.5L561.6 375.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M555.1 379.2L554.2 379.3L554.2 377.7L555.1 377.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M554.2 379.3L553.3 379.2L553.3 377.6L554.2 377.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M553.3 379.2L552.6 379L552.6 377.4L553.3 377.6ZM552.6 379L547.9 375.7L547.9 374.1L552.6 377.4ZM547.9 375.7L547.5 375.3L547.5 373.7L547.9 374.1Z\"/><path class=\"iso-top\" d=\"M562 373.9L562.3 374.4L562.2 374.8L561.6 375.2L555.1 377.5L554.2 377.7L553.3 377.6L552.6 377.4L547.9 374.1L547.5 373.7L547.7 373.2L548.3 372.9L554.8 370.5L555.7 370.3L556.5 370.4L557.2 370.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M562.3 374.4L562.2 374.8L561.6 375.2L555.1 377.5L554.2 377.7L553.3 377.6L552.6 377.4L547.9 374.1L547.5 373.7\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M547.5 373.7L547.7 373.2L548.3 372.9L554.8 370.5L555.7 370.3L556.5 370.4L557.2 370.7L562 373.9L562.3 374.4M562.3 376L562.2 376.4L561.6 376.8L555.1 379.2L554.2 379.3L553.3 379.2L552.6 379L547.9 375.7L547.5 375.3M562.3 374.4L562.3 376M547.5 373.7L547.5 375.3\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M385.4 214L385.8 213.7L388.1 212.9L388.8 212.8L389.4 213L565.3 334.1L565.5 334.5L565.5 343.5L565.1 343.8L562.9 344.6L562.2 344.7L561.6 344.5L385.6 223.4L385.4 223.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M565.5 343.5L565.1 343.8L565.1 334.8L565.5 334.5ZM565.1 343.8L562.9 344.6L562.9 335.6L565.1 334.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M562.9 344.6L562.2 344.7L562.2 335.7L562.9 335.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M562.2 344.7L561.6 344.5L561.6 335.5L562.2 335.7ZM561.6 344.5L385.6 223.4L385.6 214.4L561.6 335.5ZM385.6 223.4L385.4 223.1L385.4 214L385.6 214.4Z\"/><path class=\"iso-top\" d=\"M565.3 334.1L565.5 334.5L565.1 334.8L562.9 335.6L562.2 335.7L561.6 335.5L385.6 214.4L385.4 214L385.8 213.7L388.1 212.9L388.8 212.8L389.4 213Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M565.5 334.5L565.1 334.8L562.9 335.6L562.2 335.7L561.6 335.5L385.6 214.4L385.4 214\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M565.5 334.5L564.8 334.6L562.7 335.4L562.3 335.5L561.9 335.3L386 214.3L385.4 214\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M385.4 214L385.8 213.7L388.1 212.9L388.8 212.8L389.4 213L565.3 334.1L565.5 334.5M565.5 343.5L565.1 343.8L562.9 344.6L562.2 344.7L561.6 344.5L385.6 223.4L385.4 223.1M565.5 334.5L565.5 343.5M385.4 214L385.4 223.1\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M362.8 225.2L363 225L384.6 217.2L385 217.1L385.4 217.3L561.8 338.6L561.9 338.9L561.9 343.9L561.7 344.1L540.1 351.9L539.7 352L539.3 351.8L362.9 230.5L362.8 230.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M561.9 343.9L561.7 344.1L561.7 339.1L561.9 338.9ZM561.7 344.1L540.1 351.9L540.1 346.9L561.7 339.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M540.1 351.9L539.7 352L539.7 346.9L540.1 346.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M539.7 352L539.3 351.8L539.3 346.8L539.7 346.9ZM539.3 351.8L362.9 230.5L362.9 225.4L539.3 346.8ZM362.9 230.5L362.8 230.2L362.8 225.2L362.9 225.4Z\"/><path class=\"iso-top\" d=\"M561.8 338.6L561.9 338.9L561.7 339.1L540.1 346.9L539.7 346.9L539.3 346.8L362.9 225.4L362.8 225.2L363 225L384.6 217.2L385 217.1L385.4 217.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M561.9 338.9L561.7 339.1L540.1 346.9L539.7 346.9L539.3 346.8L362.9 225.4L362.8 225.2\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M362.8 225.2L363 225L384.6 217.2L385 217.1L385.4 217.3L561.8 338.6L561.9 338.9M561.9 343.9L561.7 344.1L540.1 351.9L539.7 352L539.3 351.8L362.9 230.5L362.8 230.2M561.9 338.9L561.9 343.9M362.8 225.2L362.8 230.2\"/></g><g class=\"bk-slats\"><path class=\"iso-line\" data-tone=\"faint\" d=\"M389.2 219.8L366.7 228M394.6 223.6L372.1 231.8M400.1 227.3L377.6 235.5M405.5 231.1L383 239.3M410.9 234.8L388.5 243M416.4 238.6L393.9 246.8M421.8 242.3L399.3 250.5M427.3 246.1L404.8 254.3M432.7 249.8L410.2 258M438.2 253.6L415.7 261.8M443.6 257.3L421.1 265.5M449.1 261.1L426.6 269.3M454.5 264.8L432 273M460 268.6L437.5 276.8M465.4 272.3L442.9 280.5M470.9 276.1L448.4 284.3M476.3 279.8L453.8 288M481.8 283.6L459.3 291.8M487.2 287.3L464.7 295.5M492.7 291.1L470.2 299.2M498.1 294.8L475.6 303M503.6 298.6L481.1 306.7M509 302.3L486.5 310.5M514.5 306.1L492 314.2M519.9 309.8L497.4 318M525.4 313.6L502.9 321.7M530.8 317.3L508.3 325.5M536.3 321.1L513.8 329.2M541.7 324.8L519.2 333M547.1 328.6L524.7 336.7M552.6 332.3L530.1 340.5M558 336.1L535.5 344.2\"/></g><g data-part=\"lane\" data-lane=\"0\"></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M388.3 178L388.5 177.8L391.3 176.8L391.8 176.7L392.1 176.8L394.2 178.2L394.3 178.5L394.3 224.6L394.1 224.8L391.2 225.8L390.8 225.9L390.4 225.8L388.4 224.3L388.3 224.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M394.3 224.6L394.1 224.8L394.1 178.6L394.3 178.5ZM394.1 224.8L391.2 225.8L391.2 179.7L394.1 178.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M391.2 225.8L390.8 225.9L390.8 179.7L391.2 179.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M390.8 225.9L390.4 225.8L390.4 179.6L390.8 179.7ZM390.4 225.8L388.4 224.3L388.4 178.2L390.4 179.6ZM388.4 224.3L388.3 224.1L388.3 178L388.4 178.2Z\"/><path class=\"iso-top\" d=\"M394.2 178.2L394.3 178.5L394.1 178.6L391.2 179.7L390.8 179.7L390.4 179.6L388.4 178.2L388.3 178L388.5 177.8L391.3 176.8L391.8 176.7L392.1 176.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M394.3 178.5L394.1 178.6L391.2 179.7L390.8 179.7L390.4 179.6L388.4 178.2L388.3 178\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M394.3 178.5L393.7 178.5L391 179.5L390.9 179.5L390.7 179.4L388.8 178.1L388.3 178\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M388.3 178L388.5 177.8L391.3 176.8L391.8 176.7L392.1 176.8L394.2 178.2L394.3 178.5M394.3 224.6L394.1 224.8L391.2 225.8L390.8 225.9L390.4 225.8L388.4 224.3L388.3 224.1M394.3 178.5L394.3 224.6M388.3 178L388.3 224.1\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M360.2 188.2L360.4 188L363.2 187L363.6 186.9L364 187L366.1 188.5L366.2 188.7L366.2 234.8L365.9 235L363.1 236L362.7 236.1L362.3 236L360.3 234.6L360.2 234.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M366.2 234.8L365.9 235L365.9 188.9L366.2 188.7ZM365.9 235L363.1 236L363.1 189.9L365.9 188.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M363.1 236L362.7 236.1L362.7 189.9L363.1 189.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M362.7 236.1L362.3 236L362.3 189.8L362.7 189.9ZM362.3 236L360.3 234.6L360.3 188.4L362.3 189.8ZM360.3 234.6L360.2 234.3L360.2 188.2L360.3 188.4Z\"/><path class=\"iso-top\" d=\"M366.1 188.5L366.2 188.7L365.9 188.9L363.1 189.9L362.7 189.9L362.3 189.8L360.3 188.4L360.2 188.2L360.4 188L363.2 187L363.6 186.9L364 187Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M366.2 188.7L365.9 188.9L363.1 189.9L362.7 189.9L362.3 189.8L360.3 188.4L360.2 188.2\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M366.2 188.7L365.6 188.7L362.9 189.7L362.8 189.7L362.6 189.6L360.7 188.3L360.2 188.2\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M360.2 188.2L360.4 188L363.2 187L363.6 186.9L364 187L366.1 188.5L366.2 188.7M366.2 234.8L365.9 235L363.1 236L362.7 236.1L362.3 236L360.3 234.6L360.2 234.3M366.2 188.7L366.2 234.8M360.2 188.2L360.2 234.3\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M359.5 183.7L359.8 183.5L391.5 172L392 171.9L392.5 172.1L395.7 174.3L395.9 174.6L395.9 178.6L395.6 178.8L363.9 190.3L363.4 190.4L362.9 190.2L359.7 188L359.5 187.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M395.9 178.6L395.6 178.8L395.6 174.8L395.9 174.6ZM395.6 178.8L363.9 190.3L363.9 186.3L395.6 174.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M363.9 190.3L363.4 190.4L363.4 186.4L363.9 186.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M363.4 190.4L362.9 190.2L362.9 186.2L363.4 186.4ZM362.9 190.2L359.7 188L359.7 184L362.9 186.2ZM359.7 188L359.5 187.7L359.5 183.7L359.7 184Z\"/><path class=\"iso-top\" d=\"M395.7 174.3L395.9 174.6L395.6 174.8L363.9 186.3L363.4 186.4L362.9 186.2L359.7 184L359.5 183.7L359.8 183.5L391.5 172L392 171.9L392.5 172.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M395.9 174.6L395.6 174.8L363.9 186.3L363.4 186.4L362.9 186.2L359.7 184L359.5 183.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M395.9 174.6L395.2 174.6L363.7 186L363.5 186.1L363.3 186L360.2 183.9L359.5 183.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M359.5 183.7L359.8 183.5L391.5 172L392 171.9L392.5 172.1L395.7 174.3L395.9 174.6M395.9 178.6L395.6 178.8L363.9 190.3L363.4 190.4L362.9 190.2L359.7 188L359.5 187.7M395.9 174.6L395.9 178.6M359.5 183.7L359.5 187.7\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"392.2\" cy=\"173.9\" r=\"0.45\"/><circle cx=\"362.2\" cy=\"184.8\" r=\"0.45\"/></g><g data-part=\"gate\"><g class=\"iso-solid bk-blade\"><path class=\"iso-fill\" d=\"M365.4 206.5L365.6 206.4L387.5 198.4L387.8 198.4L388 198.5L389 199.1L389 199.3L389 219.3L388.9 219.4L366.9 227.4L366.7 227.4L366.5 227.4L365.5 226.7L365.4 226.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M389 219.3L388.9 219.4L388.9 199.4L389 199.3ZM388.9 219.4L366.9 227.4L366.9 207.3L388.9 199.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M366.9 227.4L366.7 227.4L366.7 207.4L366.9 207.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M366.7 227.4L366.5 227.4L366.5 207.3L366.7 207.4ZM366.5 227.4L365.5 226.7L365.5 206.6L366.5 207.3ZM365.5 226.7L365.4 226.6L365.4 206.5L365.5 206.6Z\"/><path class=\"iso-top\" d=\"M389 199.1L389 199.3L388.9 199.4L366.9 207.3L366.7 207.4L366.5 207.3L365.5 206.6L365.4 206.5L365.6 206.4L387.5 198.4L387.8 198.4L388 198.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M389 199.3L388.9 199.4L366.9 207.3L366.7 207.4L366.5 207.3L365.5 206.6L365.4 206.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M389 199.3L388.6 199.3L366.8 207.2L366.7 207.2L366.7 207.2L365.8 206.6L365.4 206.5\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M365.4 206.5L365.6 206.4L387.5 198.4L387.8 198.4L388 198.5L389 199.1L389 199.3M389 219.3L388.9 219.4L366.9 227.4L366.7 227.4L366.5 227.4L365.5 226.7L365.4 226.6M389 199.3L389 219.3M365.4 206.5L365.4 226.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"386.3\" cy=\"204.8\" r=\"0.45\"/><circle cx=\"369.5\" cy=\"210.9\" r=\"0.45\"/></g></g><g data-part=\"lane\" data-lane=\"1\"></g><g data-part=\"ram\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M426.9 217.2L427.3 216.7L428 216.3L429 216.1L430.1 216L431.1 216.2L431.9 216.6L432.4 217.1L432.4 217.6L432.4 235.7L432 236.2L431.3 236.6L430.3 236.8L429.2 236.8L428.2 236.6L427.4 236.3L427 235.8L426.9 235.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M432.4 235.7L432 236.2L432 218.1L432.4 217.6ZM432 236.2L431.3 236.6L431.3 218.5L432 218.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M431.3 236.6L430.3 236.8L430.3 218.8L431.3 218.5ZM430.3 236.8L429.2 236.8L429.2 218.8L430.3 218.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M429.2 236.8L428.2 236.6L428.2 218.6L429.2 218.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M428.2 236.6L427.4 236.3L427.4 218.2L428.2 218.6ZM427.4 236.3L427 235.8L427 217.7L427.4 218.2ZM427 235.8L426.9 235.2L426.9 217.2L427 217.7Z\"/><path class=\"iso-top\" d=\"M431.3 218.5L430.3 218.8L429.2 218.8L428.2 218.6L427.4 218.2L427 217.7L426.9 217.2L427.3 216.7L428 216.3L429 216.1L430.1 216L431.1 216.2L431.9 216.6L432.4 217.1L432.4 217.6L432 218.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M426.9 217.2L427.3 216.7L428 216.3L429 216.1L430.1 216L431.1 216.2L431.9 216.6L432.4 217.1L432.4 217.6M432.4 235.7L432 236.2L431.3 236.6L430.3 236.8L429.2 236.8L428.2 236.6L427.4 236.3L427 235.8L426.9 235.2M426.9 217.2L426.9 235.2M432.4 217.6L432.4 235.7\"/></g><g class=\"iso-solid bk-die\"><path class=\"iso-fill\" d=\"M422.7 235.3L423 234.5L423.5 233.8L424.4 233.2L425.6 232.7L426.9 232.3L428.4 232L430 232L431.5 232.1L433 232.4L434.2 232.8L435.3 233.4L436.1 234.1L436.5 234.8L436.6 235.6L436.6 241.6L436.4 242.4L435.8 243.1L434.9 243.8L433.7 244.3L432.4 244.7L430.9 244.9L429.4 245L427.8 244.8L426.4 244.5L425.1 244.1L424 243.5L423.3 242.8L422.8 242.1L422.7 241.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M436.6 241.6L436.4 242.4L436.4 236.4L436.6 235.6ZM436.4 242.4L435.8 243.1L435.8 237.1L436.4 236.4ZM435.8 243.1L434.9 243.8L434.9 237.8L435.8 237.1ZM434.9 243.8L433.7 244.3L433.7 238.3L434.9 237.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M433.7 244.3L432.4 244.7L432.4 238.7L433.7 238.3ZM432.4 244.7L430.9 244.9L430.9 238.9L432.4 238.7ZM430.9 244.9L429.4 245L429.4 238.9L430.9 238.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M429.4 245L427.8 244.8L427.8 238.8L429.4 238.9ZM427.8 244.8L426.4 244.5L426.4 238.5L427.8 238.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M426.4 244.5L425.1 244.1L425.1 238.1L426.4 238.5ZM425.1 244.1L424 243.5L424 237.5L425.1 238.1ZM424 243.5L423.3 242.8L423.3 236.8L424 237.5ZM423.3 242.8L422.8 242.1L422.8 236.1L423.3 236.8ZM422.8 242.1L422.7 241.3L422.7 235.3L422.8 236.1Z\"/><path class=\"iso-top\" d=\"M433.7 238.3L432.4 238.7L430.9 238.9L429.4 238.9L427.8 238.8L426.4 238.5L425.1 238.1L424 237.5L423.3 236.8L422.8 236.1L422.7 235.3L423 234.5L423.5 233.8L424.4 233.2L425.6 232.7L426.9 232.3L428.4 232L430 232L431.5 232.1L433 232.4L434.2 232.8L435.3 233.4L436.1 234.1L436.5 234.8L436.6 235.6L436.4 236.4L435.8 237.1L434.9 237.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M436.6 235.6L436.4 236.4L435.8 237.1L434.9 237.8L433.7 238.3L432.4 238.7L430.9 238.9L429.4 238.9L427.8 238.8L426.4 238.5L425.1 238.1L424 237.5L423.3 236.8L422.8 236.1L422.7 235.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M436.6 235.6L435.8 236.3L435.3 237L434.5 237.6L433.4 238L432.2 238.4L430.8 238.6L429.4 238.6L428 238.5L426.6 238.3L425.5 237.9L424.5 237.3L423.8 236.7L423.4 236L422.7 235.3\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M422.7 235.3L423 234.5L423.5 233.8L424.4 233.2L425.6 232.7L426.9 232.3L428.4 232L430 232L431.5 232.1L433 232.4L434.2 232.8L435.3 233.4L436.1 234.1L436.5 234.8L436.6 235.6M436.6 241.6L436.4 242.4L435.8 243.1L434.9 243.8L433.7 244.3L432.4 244.7L430.9 244.9L429.4 245L427.8 244.8L426.4 244.5L425.1 244.1L424 243.5L423.3 242.8L422.8 242.1L422.7 241.3M422.7 235.3L422.7 241.3M436.6 235.6L436.6 241.6\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M432 243.1L430.9 243.4L429.7 243.5L428.4 243.4L427.3 243.1L426.5 242.6L425.9 242.1L425.7 241.5L425.9 240.9L426.5 240.3L427.3 239.9L428.4 239.6L429.7 239.5L430.9 239.6L432 239.9L432.9 240.3L433.4 240.9L433.6 241.5L433.4 242.1L432.9 242.6Z\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M418.1 215.1L418.2 214.7L418.8 214.3L455.4 201L456.2 200.9L457.1 201L457.8 201.2L465.3 206.4L465.6 206.8L465.6 218.9L465.5 219.3L464.9 219.7L428.3 232.9L427.5 233.1L426.6 233L425.9 232.7L418.4 227.6L418.1 227.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M465.6 218.9L465.5 219.3L465.5 207.3L465.6 206.8ZM465.5 219.3L464.9 219.7L464.9 207.6L465.5 207.3ZM464.9 219.7L428.3 232.9L428.3 220.9L464.9 207.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M428.3 232.9L427.5 233.1L427.5 221.1L428.3 220.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M427.5 233.1L426.6 233L426.6 221L427.5 221.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M426.6 233L425.9 232.7L425.9 220.7L426.6 221ZM425.9 232.7L418.4 227.6L418.4 215.5L425.9 220.7ZM418.4 227.6L418.1 227.2L418.1 215.1L418.4 215.5Z\"/><path class=\"iso-top\" d=\"M465.3 206.4L465.6 206.8L465.5 207.3L464.9 207.6L428.3 220.9L427.5 221.1L426.6 221L425.9 220.7L418.4 215.5L418.1 215.1L418.2 214.7L418.8 214.3L455.4 201L456.2 200.9L457.1 201L457.8 201.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M465.6 206.8L465.5 207.3L464.9 207.6L428.3 220.9L427.5 221.1L426.6 221L425.9 220.7L418.4 215.5L418.1 215.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M465.6 206.8L464.8 207.1L464.4 207.4L428 220.6L427.4 220.7L426.9 220.7L426.4 220.5L419 215.4L418.1 215.1\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M465.6 212.8L465.5 213.3L464.9 213.6L428.3 226.9L427.5 227.1L426.6 227L425.9 226.7L418.4 221.6L418.1 221.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M418.1 215.1L418.2 214.7L418.8 214.3L455.4 201L456.2 200.9L457.1 201L457.8 201.2L465.3 206.4L465.6 206.8M465.6 218.9L465.5 219.3L464.9 219.7L428.3 232.9L427.5 233.1L426.6 233L425.9 232.7L418.4 227.6L418.1 227.2M465.6 206.8L465.6 218.9M418.1 215.1L418.1 227.2\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M423.9 227.3L424.1 226.7L424.6 226.1L425.3 225.5L426.3 225.1L427.4 224.8L428.6 224.6L429.9 224.5L431.2 224.6L432.4 224.9L433.5 225.3L434.4 225.7L435 226.3L435.4 226.9L435.5 227.6L435.5 237.6L435.2 238.2L434.8 238.8L434 239.4L433.1 239.8L431.9 240.1L430.7 240.3L429.4 240.4L428.1 240.3L426.9 240L425.9 239.7L425 239.2L424.3 238.6L424 238L423.9 237.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M435.5 237.6L435.2 238.2L435.2 228.2L435.5 227.6ZM435.2 238.2L434.8 238.8L434.8 228.8L435.2 228.2ZM434.8 238.8L434 239.4L434 229.3L434.8 228.8ZM434 239.4L433.1 239.8L433.1 229.8L434 229.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M433.1 239.8L431.9 240.1L431.9 230.1L433.1 229.8ZM431.9 240.1L430.7 240.3L430.7 230.3L431.9 230.1ZM430.7 240.3L429.4 240.4L429.4 230.3L430.7 230.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M429.4 240.4L428.1 240.3L428.1 230.2L429.4 230.3ZM428.1 240.3L426.9 240L426.9 230L428.1 230.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M426.9 240L425.9 239.7L425.9 229.6L426.9 230ZM425.9 239.7L425 239.2L425 229.1L425.9 229.6ZM425 239.2L424.3 238.6L424.3 228.6L425 229.1ZM424.3 238.6L424 238L424 228L424.3 228.6ZM424 238L423.9 237.3L423.9 227.3L424 228Z\"/><path class=\"iso-top\" d=\"M433.1 229.8L431.9 230.1L430.7 230.3L429.4 230.3L428.1 230.2L426.9 230L425.9 229.6L425 229.1L424.3 228.6L424 228L423.9 227.3L424.1 226.7L424.6 226.1L425.3 225.5L426.3 225.1L427.4 224.8L428.6 224.6L429.9 224.5L431.2 224.6L432.4 224.9L433.5 225.3L434.4 225.7L435 226.3L435.4 226.9L435.5 227.6L435.2 228.2L434.8 228.8L434 229.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M435.5 227.6L435.2 228.2L434.8 228.8L434 229.3L433.1 229.8L431.9 230.1L430.7 230.3L429.4 230.3L428.1 230.2L426.9 230L425.9 229.6L425 229.1L424.3 228.6L424 228L423.9 227.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M435.5 227.6L434.7 228.1L434.3 228.7L433.6 229.2L432.7 229.5L431.7 229.8L430.6 230L429.4 230L428.3 229.9L427.2 229.7L426.2 229.4L425.4 229L424.9 228.5L424.5 227.9L423.9 227.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M423.9 227.3L424.1 226.7L424.6 226.1L425.3 225.5L426.3 225.1L427.4 224.8L428.6 224.6L429.9 224.5L431.2 224.6L432.4 224.9L433.5 225.3L434.4 225.7L435 226.3L435.4 226.9L435.5 227.6M435.5 237.6L435.2 238.2L434.8 238.8L434 239.4L433.1 239.8L431.9 240.1L430.7 240.3L429.4 240.4L428.1 240.3L426.9 240L425.9 239.7L425 239.2L424.3 238.6L424 238L423.9 237.3M423.9 227.3L423.9 237.3M435.5 227.6L435.5 237.6\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M435.5 233.5L435.4 233.9L435.2 234.4L434.8 234.8L434.4 235.2L433.8 235.5L433.1 235.8L432.3 236L431.5 236.2L430.6 236.3L429.7 236.4L428.8 236.3L427.9 236.2L427 236L426.3 235.8L425.6 235.5L425 235.2L424.5 234.8L424.2 234.4L423.9 233.9L423.9 233.5\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M459.6 195.9L459.8 195.4L460.5 195L461.5 194.8L462.5 194.8L463.4 195.1L464 195.5L464.2 196L464.2 208L463.9 208.5L463.2 208.9L462.3 209.1L461.3 209.1L460.3 208.9L459.7 208.4L459.6 207.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M464.2 208L463.9 208.5L463.9 196.5L464.2 196ZM463.9 208.5L463.2 208.9L463.2 196.9L463.9 196.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M463.2 208.9L462.3 209.1L462.3 197.1L463.2 196.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M462.3 209.1L461.3 209.1L461.3 197.1L462.3 197.1ZM461.3 209.1L460.3 208.9L460.3 196.8L461.3 197.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M460.3 208.9L459.7 208.4L459.7 196.4L460.3 196.8ZM459.7 208.4L459.6 207.9L459.6 195.9L459.7 196.4Z\"/><path class=\"iso-top\" d=\"M463.2 196.9L462.3 197.1L461.3 197.1L460.3 196.8L459.7 196.4L459.6 195.9L459.8 195.4L460.5 195L461.5 194.8L462.5 194.8L463.4 195.1L464 195.5L464.2 196L463.9 196.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M459.6 195.9L459.8 195.4L460.5 195L461.5 194.8L462.5 194.8L463.4 195.1L464 195.5L464.2 196M464.2 208L463.9 208.5L463.2 208.9L462.3 209.1L461.3 209.1L460.3 208.9L459.7 208.4L459.6 207.9M459.6 195.9L459.6 207.9M464.2 196L464.2 208\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M458.4 189.9L458.6 189.4L459.1 188.9L459.8 188.5L460.8 188.3L461.9 188.2L462.9 188.3L463.9 188.5L464.7 188.9L465.2 189.4L465.3 189.9L465.3 196L465.2 196.5L464.7 197L463.9 197.4L462.9 197.6L461.9 197.7L460.8 197.6L459.8 197.4L459.1 197L458.6 196.5L458.4 196Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M465.3 196L465.2 196.5L465.2 190.5L465.3 189.9ZM465.2 196.5L464.7 197L464.7 191L465.2 190.5ZM464.7 197L463.9 197.4L463.9 191.3L464.7 191Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M463.9 197.4L462.9 197.6L462.9 191.6L463.9 191.3ZM462.9 197.6L461.9 197.7L461.9 191.7L462.9 191.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M461.9 197.7L460.8 197.6L460.8 191.6L461.9 191.7ZM460.8 197.6L459.8 197.4L459.8 191.3L460.8 191.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M459.8 197.4L459.1 197L459.1 191L459.8 191.3ZM459.1 197L458.6 196.5L458.6 190.5L459.1 191ZM458.6 196.5L458.4 196L458.4 189.9L458.6 190.5Z\"/><path class=\"iso-top\" d=\"M463.9 191.3L462.9 191.6L461.9 191.7L460.8 191.6L459.8 191.3L459.1 191L458.6 190.5L458.4 189.9L458.6 189.4L459.1 188.9L459.8 188.5L460.8 188.3L461.9 188.2L462.9 188.3L463.9 188.5L464.7 188.9L465.2 189.4L465.3 189.9L465.2 190.5L464.7 191Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M465.3 189.9L465.2 190.5L464.7 191L463.9 191.3L462.9 191.6L461.9 191.7L460.8 191.6L459.8 191.3L459.1 191L458.6 190.5L458.4 189.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M458.4 189.9L458.6 189.4L459.1 188.9L459.8 188.5L460.8 188.3L461.9 188.2L462.9 188.3L463.9 188.5L464.7 188.9L465.2 189.4L465.3 189.9M465.3 196L465.2 196.5L464.7 197L463.9 197.4L462.9 197.6L461.9 197.7L460.8 197.6L459.8 197.4L459.1 197L458.6 196.5L458.4 196M458.4 189.9L458.4 196M465.3 189.9L465.3 196\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M463.9 197L463.9 191.7M462.8 197.2L462.8 192M461.6 197.3L461.6 192.1M460.5 197.1L460.5 191.9M459.5 196.8L459.5 191.6M458.7 196.3L458.7 191.1M465.2 196L465.2 190.8M464.8 196.5L464.8 191.3\"/><g data-part=\"lane\" data-lane=\"2\"></g><g data-part=\"turnstile\" transform=\"\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M464.8 238.8L465 238.4L465.5 238L466.3 237.9L467.1 238L467.8 238.2L468.1 238.6L468.1 272.7L467.9 273.1L467.4 273.5L466.6 273.6L465.8 273.6L465.1 273.3L464.8 272.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M468.1 272.7L467.9 273.1L467.9 239L468.1 238.6ZM467.9 273.1L467.4 273.5L467.4 239.4L467.9 239Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M467.4 273.5L466.6 273.6L466.6 239.5L467.4 239.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M466.6 273.6L465.8 273.6L465.8 239.4L466.6 239.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M465.8 273.6L465.1 273.3L465.1 239.2L465.8 239.4ZM465.1 273.3L464.8 272.9L464.8 238.8L465.1 239.2Z\"/><path class=\"iso-top\" d=\"M467.4 239.4L466.6 239.5L465.8 239.4L465.1 239.2L464.8 238.8L465 238.4L465.5 238L466.3 237.9L467.1 238L467.8 238.2L468.1 238.6L467.9 239Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M464.8 238.8L465 238.4L465.5 238L466.3 237.9L467.1 238L467.8 238.2L468.1 238.6M468.1 272.7L467.9 273.1L467.4 273.5L466.6 273.6L465.8 273.6L465.1 273.3L464.8 272.9M464.8 238.8L464.8 272.9M468.1 238.6L468.1 272.7\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M462.8 272L462.8 271.5L463.1 271.1L463.6 270.6L464.3 270.3L465.1 270.1L466.1 270L467 270L467.9 270.1L468.8 270.4L469.4 270.7L469.9 271.1L470.1 271.6L470.1 283.7L470.1 284.1L469.8 284.6L469.3 285L468.6 285.3L467.8 285.6L466.8 285.7L465.9 285.7L464.9 285.5L464.1 285.3L463.4 284.9L463 284.5L462.8 284Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M470.1 283.7L470.1 284.1L470.1 272.1L470.1 271.6ZM470.1 284.1L469.8 284.6L469.8 272.6L470.1 272.1ZM469.8 284.6L469.3 285L469.3 273L469.8 272.6ZM469.3 285L468.6 285.3L468.6 273.3L469.3 273Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M468.6 285.3L467.8 285.6L467.8 273.5L468.6 273.3ZM467.8 285.6L466.8 285.7L466.8 273.7L467.8 273.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M466.8 285.7L465.9 285.7L465.9 273.6L466.8 273.7ZM465.9 285.7L464.9 285.5L464.9 273.5L465.9 273.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M464.9 285.5L464.1 285.3L464.1 273.2L464.9 273.5ZM464.1 285.3L463.4 284.9L463.4 272.9L464.1 273.2ZM463.4 284.9L463 284.5L463 272.5L463.4 272.9ZM463 284.5L462.8 284L462.8 272L463 272.5Z\"/><path class=\"iso-top\" d=\"M468.6 273.3L467.8 273.5L466.8 273.7L465.9 273.6L464.9 273.5L464.1 273.2L463.4 272.9L463 272.5L462.8 272L462.8 271.5L463.1 271.1L463.6 270.6L464.3 270.3L465.1 270.1L466.1 270L467 270L467.9 270.1L468.8 270.4L469.4 270.7L469.9 271.1L470.1 271.6L470.1 272.1L469.8 272.6L469.3 273Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M470.1 271.6L470.1 272.1L469.8 272.6L469.3 273L468.6 273.3L467.8 273.5L466.8 273.7L465.9 273.6L464.9 273.5L464.1 273.2L463.4 272.9L463 272.5L462.8 272\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M470.1 271.6L469.6 272.1L469.4 272.5L469 272.8L468.3 273.1L467.6 273.3L466.8 273.4L465.9 273.4L465.1 273.3L464.4 273.1L463.8 272.8L463.4 272.4L462.8 272\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M462.8 272L462.8 271.5L463.1 271.1L463.6 270.6L464.3 270.3L465.1 270.1L466.1 270L467 270L467.9 270.1L468.8 270.4L469.4 270.7L469.9 271.1L470.1 271.6M470.1 283.7L470.1 284.1L469.8 284.6L469.3 285L468.6 285.3L467.8 285.6L466.8 285.7L465.9 285.7L464.9 285.5L464.1 285.3L463.4 284.9L463 284.5L462.8 284M462.8 272L462.8 284M470.1 271.6L470.1 283.7\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M470.1 277.8L470.1 278.2L469.9 278.5L469.5 278.9L469.1 279.1L468.5 279.4L467.9 279.5L467.2 279.6L466.4 279.7L465.7 279.6L465 279.5L464.4 279.4L463.8 279.1L463.4 278.9L463 278.5L462.8 278.2L462.7 277.8\"/><g data-part=\"paddles\"></g></g><g data-part=\"lane\" data-lane=\"3\"></g><g data-part=\"sieve\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M489.3 289.3L489.5 289.1L509.4 281.9L509.7 281.9L510.1 282L511.5 283L511.6 283.2L511.6 304.2L511.4 304.4L491.6 311.6L491.2 311.6L490.9 311.5L489.4 310.5L489.3 310.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M511.6 304.2L511.4 304.4L511.4 283.3L511.6 283.2ZM511.4 304.4L491.6 311.6L491.6 290.5L511.4 283.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M491.6 311.6L491.2 311.6L491.2 290.6L491.6 290.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M491.2 311.6L490.9 311.5L490.9 290.5L491.2 290.6ZM490.9 311.5L489.4 310.5L489.4 289.4L490.9 290.5ZM489.4 310.5L489.3 310.3L489.3 289.3L489.4 289.4Z\"/><path class=\"iso-top\" d=\"M511.5 283L511.6 283.2L511.4 283.3L491.6 290.5L491.2 290.6L490.9 290.5L489.4 289.4L489.3 289.3L489.5 289.1L509.4 281.9L509.7 281.9L510.1 282Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M511.6 283.2L511.4 283.3L491.6 290.5L491.2 290.6L490.9 290.5L489.4 289.4L489.3 289.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M511.6 283.2L511.1 283.1L491.4 290.3L491.3 290.3L491.2 290.3L489.8 289.3L489.3 289.3\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M489.3 289.3L489.5 289.1L509.4 281.9L509.7 281.9L510.1 282L511.5 283L511.6 283.2M511.6 304.2L511.4 304.4L491.6 311.6L491.2 311.6L490.9 311.5L489.4 310.5L489.3 310.3M511.6 283.2L511.6 304.2M489.3 289.3L489.3 310.3\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M509.9 302.9L493.1 309L493.1 292L509.9 285.9Z\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M509 303.3L509 286.2M506.2 304.3L506.2 287.2M503.4 305.3L503.4 288.2M500.6 306.3L500.6 289.3M497.8 307.3L497.8 290.3M494.9 308.4L494.9 291.3M509.9 301.9L493.1 308M509.9 298.9L493.1 305M509.9 295.9L493.1 302M509.9 292.9L493.1 299M509.9 289.9L493.1 296M509.9 286.9L493.1 293\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M507 257.2L507.4 257L508 256.9L508.6 257L509 257.2L509 283.6L508.6 283.9L508 284L507.4 283.9L507 283.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M509 283.6L508.6 283.9L508.6 257.8L509 257.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M508.6 283.9L508 284L508 257.9L508.6 257.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M508 284L507.4 283.9L507.4 257.8L508 257.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M507.4 283.9L507 283.6L507 257.6L507.4 257.8Z\"/><path class=\"iso-top\" d=\"M508.6 257.8L508 257.9L507.4 257.8L507 257.6L507 257.2L507.4 257L508 256.9L508.6 257L509 257.2L509 257.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M507 257.6L507 257.2L507.4 257L508 256.9L508.6 257L509 257.2L509 257.6M509 283.6L508.6 283.9L508 284L507.4 283.9L507 283.6M507 257.6L507 283.6M509 257.6L509 283.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M492 262.7L492.4 262.4L493 262.3L493.6 262.4L494 262.7L494 289.1L493.6 289.4L493 289.5L492.4 289.4L492 289.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M494 289.1L493.6 289.4L493.6 263.3L494 263Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M493.6 289.4L493 289.5L493 263.4L493.6 263.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M493 289.5L492.4 289.4L492.4 263.3L493 263.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M492.4 289.4L492 289.1L492 263L492.4 263.3Z\"/><path class=\"iso-top\" d=\"M493.6 263.3L493 263.4L492.4 263.3L492 263L492 262.7L492.4 262.4L493 262.3L493.6 262.4L494 262.7L494 263Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M492 263L492 262.7L492.4 262.4L493 262.3L493.6 262.4L494 262.7L494 263M494 289.1L493.6 289.4L493 289.5L492.4 289.4L492 289.1M492 263L492 289.1M494 263L494 289.1\"/></g></g><g data-part=\"lane\" data-lane=\"4\"></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M511 294L511.3 293.7L512.9 293.1L513.5 293.1L513.9 293.2L515.1 294.1L515.3 294.3L515.3 328.4L515 328.7L513.3 329.3L512.8 329.3L512.3 329.2L511.1 328.3L511 328.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M515.3 328.4L515 328.7L515 294.5L515.3 294.3ZM515 328.7L513.3 329.3L513.3 295.2L515 294.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M513.3 329.3L512.8 329.3L512.8 295.2L513.3 295.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M512.8 329.3L512.3 329.2L512.3 295.1L512.8 295.2ZM512.3 329.2L511.1 328.3L511.1 294.2L512.3 295.1ZM511.1 328.3L511 328.1L511 294L511.1 294.2Z\"/><path class=\"iso-top\" d=\"M515.1 294.1L515.3 294.3L515 294.5L513.3 295.2L512.8 295.2L512.3 295.1L511.1 294.2L511 294L511.3 293.7L512.9 293.1L513.5 293.1L513.9 293.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M511 294L511.3 293.7L512.9 293.1L513.5 293.1L513.9 293.2L515.1 294.1L515.3 294.3M515.3 328.4L515 328.7L513.3 329.3L512.8 329.3L512.3 329.2L511.1 328.3L511 328.1M515.3 294.3L515.3 328.4M511 294L511 328.1\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M526.6 304.8L526.9 304.5L528.6 303.9L529.1 303.8L529.6 304L530.8 304.8L530.9 305.1L530.9 339.2L530.6 339.4L529 340L528.4 340.1L528 340L526.8 339.1L526.6 338.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M530.9 339.2L530.6 339.4L530.6 305.3L530.9 305.1ZM530.6 339.4L529 340L529 305.9L530.6 305.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M529 340L528.4 340.1L528.4 306L529 305.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M528.4 340.1L528 340L528 305.9L528.4 306ZM528 340L526.8 339.1L526.8 305L528 305.9ZM526.8 339.1L526.6 338.9L526.6 304.8L526.8 305Z\"/><path class=\"iso-top\" d=\"M530.8 304.8L530.9 305.1L530.6 305.3L529 305.9L528.4 306L528 305.9L526.8 305L526.6 304.8L526.9 304.5L528.6 303.9L529.1 303.8L529.6 304Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M526.6 304.8L526.9 304.5L528.6 303.9L529.1 303.8L529.6 304L530.8 304.8L530.9 305.1M530.9 339.2L530.6 339.4L529 340L528.4 340.1L528 340L526.8 339.1L526.6 338.9M530.9 305.1L530.9 339.2M526.6 304.8L526.6 338.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M510.9 271.8L511.1 271.2L511.9 270.7L538.1 261.2L539.2 261L540.4 261.1L541.4 261.4L557.7 272.7L558.1 273.3L558.1 295.3L558 295.9L557.2 296.4L531 305.9L529.8 306.1L528.6 306L527.7 305.7L511.4 294.4L510.9 293.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M558.1 295.3L558 295.9L558 273.8L558.1 273.3ZM558 295.9L557.2 296.4L557.2 274.3L558 273.8ZM557.2 296.4L531 305.9L531 283.8L557.2 274.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M531 305.9L529.8 306.1L529.8 284.1L531 283.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M529.8 306.1L528.6 306L528.6 284L529.8 284.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M528.6 306L527.7 305.7L527.7 283.6L528.6 284ZM527.7 305.7L511.4 294.4L511.4 272.3L527.7 283.6ZM511.4 294.4L510.9 293.9L510.9 271.8L511.4 272.3Z\"/><path class=\"iso-top\" d=\"M557.7 272.7L558.1 273.3L558 273.8L557.2 274.3L531 283.8L529.8 284.1L528.6 284L527.7 283.6L511.4 272.3L510.9 271.8L511.1 271.2L511.9 270.7L538.1 261.2L539.2 261L540.4 261.1L541.4 261.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M558.1 273.3L558 273.8L557.2 274.3L531 283.8L529.8 284.1L528.6 284L527.7 283.6L511.4 272.3L510.9 271.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M558.1 273.3L557.1 273.7L556.6 274L530.5 283.4L529.7 283.6L529 283.5L528.4 283.3L512.2 272.1L510.9 271.8\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M558.1 284.3L558 284.9L557.2 285.4L531 294.9L529.8 295.1L528.6 295L527.7 294.6L511.4 283.4L510.9 282.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M510.9 271.8L511.1 271.2L511.9 270.7L538.1 261.2L539.2 261L540.4 261.1L541.4 261.4L557.7 272.7L558.1 273.3M558.1 295.3L558 295.9L557.2 296.4L531 305.9L529.8 306.1L528.6 306L527.7 305.7L511.4 294.4L510.9 293.9M558.1 273.3L558.1 295.3M510.9 271.8L510.9 293.9\"/></g><path class=\"bk-mouth\" d=\"M554.2 273.2L529.8 282.1L514.9 271.8L539.2 262.9Z\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M554.2 273.2L529.8 282.1L514.9 271.8L539.2 262.9Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"539.5\" cy=\"262.1\" r=\"0.45\"/><circle cx=\"555.8\" cy=\"273.4\" r=\"0.45\"/><circle cx=\"513.2\" cy=\"271.7\" r=\"0.45\"/><circle cx=\"529.6\" cy=\"282.9\" r=\"0.45\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M480 263.5L480.3 263.3L482.9 262.4L483.4 262.3L483.9 262.4L487.1 264.7L487.3 264.9L487.3 321.1L487 321.4L484.3 322.3L483.8 322.4L483.4 322.2L480.1 320L480 319.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M487.3 321.1L487 321.4L487 265.2L487.3 264.9ZM487 321.4L484.3 322.3L484.3 266.1L487 265.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M484.3 322.3L483.8 322.4L483.8 266.2L484.3 266.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M483.8 322.4L483.4 322.2L483.4 266.1L483.8 266.2ZM483.4 322.2L480.1 320L480.1 263.8L483.4 266.1ZM480.1 320L480 319.7L480 263.5L480.1 263.8Z\"/><path class=\"iso-top\" d=\"M487.1 264.7L487.3 264.9L487 265.2L484.3 266.1L483.8 266.2L483.4 266.1L480.1 263.8L480 263.5L480.3 263.3L482.9 262.4L483.4 262.3L483.9 262.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M487.3 264.9L487 265.2L484.3 266.1L483.8 266.2L483.4 266.1L480.1 263.8L480 263.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M487.3 264.9L486.6 265L484.2 265.9L483.9 266L483.7 265.9L480.5 263.7L480 263.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M480 263.5L480.3 263.3L482.9 262.4L483.4 262.3L483.9 262.4L487.1 264.7L487.3 264.9M487.3 321.1L487 321.4L484.3 322.3L483.8 322.4L483.4 322.2L480.1 320L480 319.7M487.3 264.9L487.3 321.1M480 263.5L480 319.7\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M479.4 258.1L479.8 257.8L516.7 244.3L517.4 244.3L518 244.4L522.4 247.4L522.5 247.8L522.5 252.8L522.1 253.1L485.2 266.5L484.5 266.6L483.9 266.4L479.6 263.4L479.4 263.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M522.5 252.8L522.1 253.1L522.1 248.1L522.5 247.8ZM522.1 253.1L485.2 266.5L485.2 261.5L522.1 248.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M485.2 266.5L484.5 266.6L484.5 261.6L485.2 261.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M484.5 266.6L483.9 266.4L483.9 261.4L484.5 261.6ZM483.9 266.4L479.6 263.4L479.6 258.4L483.9 261.4ZM479.6 263.4L479.4 263.1L479.4 258.1L479.6 258.4Z\"/><path class=\"iso-top\" d=\"M522.4 247.4L522.5 247.8L522.1 248.1L485.2 261.5L484.5 261.6L483.9 261.4L479.6 258.4L479.4 258.1L479.8 257.8L516.7 244.3L517.4 244.3L518 244.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M522.5 247.8L522.1 248.1L485.2 261.5L484.5 261.6L483.9 261.4L479.6 258.4L479.4 258.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M522.5 247.8L521.7 247.9L485 261.2L484.6 261.3L484.3 261.2L480.1 258.3L479.4 258.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M479.4 258.1L479.8 257.8L516.7 244.3L517.4 244.3L518 244.4L522.4 247.4L522.5 247.8M522.5 252.8L522.1 253.1L485.2 266.5L484.5 266.6L483.9 266.4L479.6 263.4L479.4 263.1M522.5 247.8L522.5 252.8M479.4 258.1L479.4 263.1\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"517.8\" cy=\"246.8\" r=\"0.45\"/><circle cx=\"483.1\" cy=\"259.4\" r=\"0.45\"/><circle cx=\"481.7\" cy=\"317.1\" r=\"0.45\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M445.9 242.1L446.2 241.9L448.8 240.9L449.4 240.9L449.8 241L453.1 243.3L453.2 243.5L453.2 297.7L452.9 297.9L450.3 298.9L449.8 298.9L449.3 298.8L446.1 296.6L445.9 296.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M453.2 297.7L452.9 297.9L452.9 243.7L453.2 243.5ZM452.9 297.9L450.3 298.9L450.3 244.7L452.9 243.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M450.3 298.9L449.8 298.9L449.8 244.8L450.3 244.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M449.8 298.9L449.3 298.8L449.3 244.6L449.8 244.8ZM449.3 298.8L446.1 296.6L446.1 242.4L449.3 244.6ZM446.1 296.6L445.9 296.3L445.9 242.1L446.1 242.4Z\"/><path class=\"iso-top\" d=\"M453.1 243.3L453.2 243.5L452.9 243.7L450.3 244.7L449.8 244.8L449.3 244.6L446.1 242.4L445.9 242.1L446.2 241.9L448.8 240.9L449.4 240.9L449.8 241Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M453.2 243.5L452.9 243.7L450.3 244.7L449.8 244.8L449.3 244.6L446.1 242.4L445.9 242.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M453.2 243.5L452.6 243.6L450.1 244.5L449.9 244.5L449.6 244.5L446.5 242.3L445.9 242.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M445.9 242.1L446.2 241.9L448.8 240.9L449.4 240.9L449.8 241L453.1 243.3L453.2 243.5M453.2 297.7L452.9 297.9L450.3 298.9L449.8 298.9L449.3 298.8L446.1 296.6L445.9 296.3M453.2 243.5L453.2 297.7M445.9 242.1L445.9 296.3\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M445.3 236.6L445.7 236.3L482.6 222.9L483.3 222.8L483.9 223L488.3 226L488.5 226.4L488.5 231.4L488.1 231.7L451.2 245.1L450.5 245.2L449.9 245L445.5 242L445.3 241.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M488.5 231.4L488.1 231.7L488.1 226.7L488.5 226.4ZM488.1 231.7L451.2 245.1L451.2 240.1L488.1 226.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M451.2 245.1L450.5 245.2L450.5 240.2L451.2 240.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M450.5 245.2L449.9 245L449.9 240L450.5 240.2ZM449.9 245L445.5 242L445.5 237L449.9 240ZM445.5 242L445.3 241.7L445.3 236.6L445.5 237Z\"/><path class=\"iso-top\" d=\"M488.3 226L488.5 226.4L488.1 226.7L451.2 240.1L450.5 240.2L449.9 240L445.5 237L445.3 236.6L445.7 236.3L482.6 222.9L483.3 222.8L483.9 223Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M488.5 226.4L488.1 226.7L451.2 240.1L450.5 240.2L449.9 240L445.5 237L445.3 236.6\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M488.5 226.4L487.7 226.5L450.9 239.8L450.6 239.9L450.3 239.8L446 236.9L445.3 236.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M445.3 236.6L445.7 236.3L482.6 222.9L483.3 222.8L483.9 223L488.3 226L488.5 226.4M488.5 231.4L488.1 231.7L451.2 245.1L450.5 245.2L449.9 245L445.5 242L445.3 241.7M488.5 226.4L488.5 231.4M445.3 236.6L445.3 241.7\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"483.8\" cy=\"225.4\" r=\"0.45\"/><circle cx=\"449.1\" cy=\"238\" r=\"0.45\"/><circle cx=\"447.7\" cy=\"293.7\" r=\"0.45\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M359.2 223.6L359.6 223.3L361.8 222.5L362.5 222.4L363.1 222.6L539.1 343.7L539.3 344L539.3 353L538.9 353.3L536.6 354.2L535.9 354.2L535.3 354.1L359.4 233L359.2 232.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M539.3 353L538.9 353.3L538.9 344.3L539.3 344ZM538.9 353.3L536.6 354.2L536.6 345.1L538.9 344.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M536.6 354.2L535.9 354.2L535.9 345.2L536.6 345.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M535.9 354.2L535.3 354.1L535.3 345L535.9 345.2ZM535.3 354.1L359.4 233L359.4 223.9L535.3 345ZM359.4 233L359.2 232.6L359.2 223.6L359.4 223.9Z\"/><path class=\"iso-top\" d=\"M539.1 343.7L539.3 344L538.9 344.3L536.6 345.1L535.9 345.2L535.3 345L359.4 223.9L359.2 223.6L359.6 223.3L361.8 222.5L362.5 222.4L363.1 222.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M539.3 344L538.9 344.3L536.6 345.1L535.9 345.2L535.3 345L359.4 223.9L359.2 223.6\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M539.3 344L538.5 344.2L536.4 344.9L536 345L535.7 344.9L359.8 223.8L359.2 223.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M359.2 223.6L359.6 223.3L361.8 222.5L362.5 222.4L363.1 222.6L539.1 343.7L539.3 344M539.3 353L538.9 353.3L536.6 354.2L535.9 354.2L535.3 354.1L359.4 233L359.2 232.6M539.3 344L539.3 353M359.2 223.6L359.2 232.6\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"365.6\" cy=\"233.3\" r=\"0.5\"/><circle cx=\"382\" cy=\"244.5\" r=\"0.5\"/><circle cx=\"398.3\" cy=\"255.8\" r=\"0.5\"/><circle cx=\"414.7\" cy=\"267\" r=\"0.5\"/><circle cx=\"431\" cy=\"278.2\" r=\"0.5\"/><circle cx=\"447.4\" cy=\"289.5\" r=\"0.5\"/><circle cx=\"463.7\" cy=\"300.7\" r=\"0.5\"/><circle cx=\"480\" cy=\"312\" r=\"0.5\"/><circle cx=\"496.4\" cy=\"323.2\" r=\"0.5\"/><circle cx=\"512.7\" cy=\"334.5\" r=\"0.5\"/><circle cx=\"529.1\" cy=\"345.7\" r=\"0.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M371.1 242.3L371.4 242L374.6 240.8L375.3 240.7L375.9 240.9L378.2 242.5L378.4 242.8L378.4 281L378 281.3L374.9 282.4L374.2 282.5L373.6 282.3L371.2 280.7L371.1 280.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M378.4 281L378 281.3L378 243.1L378.4 242.8ZM378 281.3L374.9 282.4L374.9 244.3L378 243.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M374.9 282.4L374.2 282.5L374.2 244.4L374.9 244.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M374.2 282.5L373.6 282.3L373.6 244.2L374.2 244.4ZM373.6 282.3L371.2 280.7L371.2 242.6L373.6 244.2ZM371.2 280.7L371.1 280.4L371.1 242.3L371.2 242.6Z\"/><path class=\"iso-top\" d=\"M378.2 242.5L378.4 242.8L378 243.1L374.9 244.3L374.2 244.4L373.6 244.2L371.2 242.6L371.1 242.3L371.4 242L374.6 240.8L375.3 240.7L375.9 240.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M371.1 242.3L371.4 242L374.6 240.8L375.3 240.7L375.9 240.9L378.2 242.5L378.4 242.8M378.4 281L378 281.3L374.9 282.4L374.2 282.5L373.6 282.3L371.2 280.7L371.1 280.4M378.4 242.8L378.4 281M371.1 242.3L371.1 280.4\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M367.4 278.7L367.5 278.3L368.1 277.9L374.6 275.5L375.5 275.4L376.3 275.4L377 275.7L381.8 279L382.1 279.4L382.1 281L382 281.5L381.4 281.8L374.9 284.2L374 284.4L373.1 284.3L372.4 284L367.7 280.7L367.4 280.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M382.1 281L382 281.5L382 279.9L382.1 279.4ZM382 281.5L381.4 281.8L381.4 280.2L382 279.9ZM381.4 281.8L374.9 284.2L374.9 282.6L381.4 280.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M374.9 284.2L374 284.4L374 282.8L374.9 282.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M374 284.4L373.1 284.3L373.1 282.7L374 282.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M373.1 284.3L372.4 284L372.4 282.4L373.1 282.7ZM372.4 284L367.7 280.7L367.7 279.1L372.4 282.4ZM367.7 280.7L367.4 280.3L367.4 278.7L367.7 279.1Z\"/><path class=\"iso-top\" d=\"M381.8 279L382.1 279.4L382 279.9L381.4 280.2L374.9 282.6L374 282.8L373.1 282.7L372.4 282.4L367.7 279.1L367.4 278.7L367.5 278.3L368.1 277.9L374.6 275.5L375.5 275.4L376.3 275.4L377 275.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M382.1 279.4L382 279.9L381.4 280.2L374.9 282.6L374 282.8L373.1 282.7L372.4 282.4L367.7 279.1L367.4 278.7\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M367.4 278.7L367.5 278.3L368.1 277.9L374.6 275.5L375.5 275.4L376.3 275.4L377 275.7L381.8 279L382.1 279.4M382.1 281L382 281.5L381.4 281.8L374.9 284.2L374 284.4L373.1 284.3L372.4 284L367.7 280.7L367.4 280.3M382.1 279.4L382.1 281M367.4 278.7L367.4 280.3\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M523.6 347.2L524 346.9L527.2 345.8L527.9 345.7L528.5 345.9L530.8 347.5L531 347.8L531 386L530.6 386.3L527.4 387.4L526.7 387.5L526.1 387.3L523.8 385.7L523.6 385.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M531 386L530.6 386.3L530.6 348.1L531 347.8ZM530.6 386.3L527.4 387.4L527.4 349.3L530.6 348.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M527.4 387.4L526.7 387.5L526.7 349.4L527.4 349.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M526.7 387.5L526.1 387.3L526.1 349.2L526.7 349.4ZM526.1 387.3L523.8 385.7L523.8 347.6L526.1 349.2ZM523.8 385.7L523.6 385.4L523.6 347.2L523.8 347.6Z\"/><path class=\"iso-top\" d=\"M530.8 347.5L531 347.8L530.6 348.1L527.4 349.3L526.7 349.4L526.1 349.2L523.8 347.6L523.6 347.2L524 346.9L527.2 345.8L527.9 345.7L528.5 345.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M523.6 347.2L524 346.9L527.2 345.8L527.9 345.7L528.5 345.9L530.8 347.5L531 347.8M531 386L530.6 386.3L527.4 387.4L526.7 387.5L526.1 387.3L523.8 385.7L523.6 385.4M531 347.8L531 386M523.6 347.2L523.6 385.4\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M519.9 383.7L520 383.3L520.6 382.9L527.2 380.5L528 380.4L528.9 380.4L529.6 380.7L534.4 384L534.7 384.4L534.7 386L534.5 386.5L534 386.8L527.4 389.2L526.6 389.4L525.7 389.3L525 389L520.2 385.7L519.9 385.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M534.7 386L534.5 386.5L534.5 384.9L534.7 384.4ZM534.5 386.5L534 386.8L534 385.2L534.5 384.9ZM534 386.8L527.4 389.2L527.4 387.6L534 385.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M527.4 389.2L526.6 389.4L526.6 387.8L527.4 387.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M526.6 389.4L525.7 389.3L525.7 387.7L526.6 387.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M525.7 389.3L525 389L525 387.4L525.7 387.7ZM525 389L520.2 385.7L520.2 384.1L525 387.4ZM520.2 385.7L519.9 385.3L519.9 383.7L520.2 384.1Z\"/><path class=\"iso-top\" d=\"M534.4 384L534.7 384.4L534.5 384.9L534 385.2L527.4 387.6L526.6 387.8L525.7 387.7L525 387.4L520.2 384.1L519.9 383.7L520 383.3L520.6 382.9L527.2 380.5L528 380.4L528.9 380.4L529.6 380.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M534.7 384.4L534.5 384.9L534 385.2L527.4 387.6L526.6 387.8L525.7 387.7L525 387.4L520.2 384.1L519.9 383.7\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M519.9 383.7L520 383.3L520.6 382.9L527.2 380.5L528 380.4L528.9 380.4L529.6 380.7L534.4 384L534.7 384.4M534.7 386L534.5 386.5L534 386.8L527.4 389.2L526.6 389.4L525.7 389.3L525 389L520.2 385.7L519.9 385.3M534.7 384.4L534.7 386M519.9 383.7L519.9 385.3\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M538.2 351.5L538.1 350.4L537.8 349.2L537.2 348.1L536.6 347.2L535.9 346.5L535.2 346.2L534.5 346.2L534 346.6L533.7 347.4L533.6 348.3L533.7 349.5L534 350.6L534.5 351.7L535.2 352.7L535.9 353.3L536.6 353.7L537.2 353.6L537.8 353.2L538.1 352.5Z\"/><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"535.9\" cy=\"349.9\" r=\"0.8\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M520.2 337.5L520.4 336.9L521.2 336.4L534.3 331.7L535.4 331.5L536.6 331.6L537.5 331.9L549.8 340.4L550.2 340.9L550.2 356L550 356.6L549.3 357L536.2 361.8L535 362L533.8 361.9L532.9 361.5L520.7 353.1L520.2 352.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M550.2 356L550 356.6L550 341.5L550.2 340.9ZM550 356.6L549.3 357L549.3 342L550 341.5ZM549.3 357L536.2 361.8L536.2 346.8L549.3 342Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M536.2 361.8L535 362L535 347L536.2 346.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M535 362L533.8 361.9L533.8 346.9L535 347Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M533.8 361.9L532.9 361.5L532.9 346.5L533.8 346.9ZM532.9 361.5L520.7 353.1L520.7 338.1L532.9 346.5ZM520.7 353.1L520.2 352.5L520.2 337.5L520.7 338.1Z\"/><path class=\"iso-top\" d=\"M549.8 340.4L550.2 340.9L550 341.5L549.3 342L536.2 346.8L535 347L533.8 346.9L532.9 346.5L520.7 338.1L520.2 337.5L520.4 336.9L521.2 336.4L534.3 331.7L535.4 331.5L536.6 331.6L537.5 331.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M550.2 340.9L550 341.5L549.3 342L536.2 346.8L535 347L533.8 346.9L532.9 346.5L520.7 338.1L520.2 337.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M550.2 340.9L549.5 341.4L548.9 341.8L535.9 346.5L535 346.7L534.1 346.6L533.3 346.3L521.2 337.9L520.2 337.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M520.2 337.5L520.4 336.9L521.2 336.4L534.3 331.7L535.4 331.5L536.6 331.6L537.5 331.9L549.8 340.4L550.2 340.9M550.2 356L550 356.6L549.3 357L536.2 361.8L535 362L533.8 361.9L532.9 361.5L520.7 353.1L520.2 352.5M550.2 340.9L550.2 356M520.2 337.5L520.2 352.5\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M550.2 353L550 353.6L549.3 354L536.2 358.8L535 359L533.8 358.9L532.9 358.5L520.7 350.1L520.2 349.5M550.2 350.5L550 351L549.3 351.5L536.2 356.3L535 356.5L533.8 356.4L532.9 356L520.7 347.6L520.2 347M550.2 347.9L550 348.5L549.3 349L536.2 353.8L535 354L533.8 353.9L532.9 353.5L520.7 345.1L520.2 344.5M550.2 345.4L550 346L549.3 346.5L536.2 351.3L535 351.5L533.8 351.4L532.9 351L520.7 342.6L520.2 342M550.2 342.9L550 343.5L549.3 344L536.2 348.8L535 349L533.8 348.9L532.9 348.5L520.7 340.1L520.2 339.5\"/><path class=\"iso-halo\" d=\"M328.5 279.7L328.5 279.3L328.7 279L329 278.7L329.4 278.4L329.9 278.2L356.2 268.7L356.8 268.5L357.4 268.4L358.1 268.3L358.8 268.3L359.4 268.4L360 268.6L360.6 268.8L361 269L502.7 366.5L503 366.8L503.2 367.1L503.3 367.5L503.3 380.5L503.3 380.9L503.1 381.2L502.8 381.5L502.4 381.8L501.9 382L475.7 391.5L475.1 391.7L474.4 391.8L473.8 391.9L473.1 391.8L472.4 391.8L471.8 391.6L471.3 391.4L470.8 391.1L329.2 293.7L328.8 293.4L328.6 293L328.5 292.7Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M328.5 290.8L328.8 289.9L329.9 289.2L356.2 279.7L357.9 279.4L359.6 279.5L361 280.1L502.7 377.6L503.3 378.4L503.3 380.4L503 381.3L501.9 382L475.7 391.5L474 391.8L472.2 391.7L470.8 391.1L329.2 293.7L328.5 292.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M503.3 380.4L503 381.3L503 379.3L503.3 378.4ZM503 381.3L501.9 382L501.9 380L503 379.3ZM501.9 382L475.7 391.5L475.7 389.5L501.9 380Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M475.7 391.5L474 391.8L474 389.8L475.7 389.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M474 391.8L472.2 391.7L472.2 389.7L474 389.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M472.2 391.7L470.8 391.1L470.8 389.1L472.2 389.7ZM470.8 391.1L329.2 293.7L329.2 291.7L470.8 389.1ZM329.2 293.7L328.5 292.8L328.5 290.8L329.2 291.7Z\"/><path class=\"iso-top\" d=\"M502.7 377.6L503.3 378.4L503 379.3L501.9 380L475.7 389.5L474 389.8L472.2 389.7L470.8 389.1L329.2 291.7L328.5 290.8L328.8 289.9L329.9 289.2L356.2 279.7L357.9 279.4L359.6 279.5L361 280.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M503.3 378.4L503 379.3L501.9 380L475.7 389.5L474 389.8L472.2 389.7L470.8 389.1L329.2 291.7L328.5 290.8\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M328.5 290.8L328.8 289.9L329.9 289.2L356.2 279.7L357.9 279.4L359.6 279.5L361 280.1L502.7 377.6L503.3 378.4M503.3 380.4L503 381.3L501.9 382L475.7 391.5L474 391.8L472.2 391.7L470.8 391.1L329.2 293.7L328.5 292.8M503.3 378.4L503.3 380.4M328.5 290.8L328.5 292.8\"/></g><path class=\"bk-tray-floor\" d=\"M330.8 290.6L330.9 290.3L331.3 290.1L357.5 280.5L358.1 280.4L358.7 280.5L359.2 280.7L500.8 378.1L501 378.4L501 378.5L500.9 378.8L500.5 379L474.3 388.6L473.7 388.7L473.1 388.6L472.7 388.5L331 291L330.8 290.7Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M357.3 268.3L357.5 268.2L358.6 267.8L359 267.7L359.3 267.8L504.4 367.7L504.5 367.9L504.5 381L504.3 381.1L503.2 381.5L502.9 381.6L502.6 381.5L357.4 281.5L357.3 281.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M504.5 381L504.3 381.1L504.3 368.1L504.5 367.9ZM504.3 381.1L503.2 381.5L503.2 368.5L504.3 368.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M503.2 381.5L502.9 381.6L502.9 368.5L503.2 368.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M502.9 381.6L502.6 381.5L502.6 368.4L502.9 368.5ZM502.6 381.5L357.4 281.5L357.4 268.5L502.6 368.4ZM357.4 281.5L357.3 281.4L357.3 268.3L357.4 268.5Z\"/><path class=\"iso-top\" d=\"M504.4 367.7L504.5 367.9L504.3 368.1L503.2 368.5L502.9 368.5L502.6 368.4L357.4 268.5L357.3 268.3L357.5 268.2L358.6 267.8L359 267.7L359.3 267.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M357.3 268.3L357.5 268.2L358.6 267.8L359 267.7L359.3 267.8L504.4 367.7L504.5 367.9M504.5 381L504.3 381.1L503.2 381.5L502.9 381.6L502.6 381.5L357.4 281.5L357.3 281.4M504.5 367.9L504.5 381M357.3 268.3L357.3 281.4\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M327.3 279.2L327.5 279.1L358.6 267.8L359 267.7L359.3 267.8L360.1 268.4L360.2 268.6L360.2 281.6L360 281.8L328.9 293.1L328.5 293.1L328.2 293L327.4 292.4L327.3 292.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M360.2 281.6L360 281.8L360 268.7L360.2 268.6ZM360 281.8L328.9 293.1L328.9 280L360 268.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M328.9 293.1L328.5 293.1L328.5 280.1L328.9 280Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M328.5 293.1L328.2 293L328.2 280L328.5 280.1ZM328.2 293L327.4 292.4L327.4 279.4L328.2 280ZM327.4 292.4L327.3 292.3L327.3 279.2L327.4 279.4Z\"/><path class=\"iso-top\" d=\"M360.1 268.4L360.2 268.6L360 268.7L328.9 280L328.5 280.1L328.2 280L327.4 279.4L327.3 279.2L327.5 279.1L358.6 267.8L359 267.7L359.3 267.8Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M327.3 279.2L327.5 279.1L358.6 267.8L359 267.7L359.3 267.8L360.1 268.4L360.2 268.6M360.2 281.6L360 281.8L328.9 293.1L328.5 293.1L328.2 293L327.4 292.4L327.3 292.3M360.2 268.6L360.2 281.6M327.3 279.2L327.3 292.3\"/></g><g data-part=\"lane\" data-lane=\"tray\"></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M471.7 378.6L471.9 378.4L503 367.1L503.3 367.1L503.6 367.2L504.4 367.7L504.5 367.9L504.5 381L504.3 381.1L473.2 392.4L472.9 392.5L472.6 392.4L471.8 391.8L471.7 391.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M504.5 381L504.3 381.1L504.3 368.1L504.5 367.9ZM504.3 381.1L473.2 392.4L473.2 379.4L504.3 368.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M473.2 392.4L472.9 392.5L472.9 379.4L473.2 379.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M472.9 392.5L472.6 392.4L472.6 379.3L472.9 379.4ZM472.6 392.4L471.8 391.8L471.8 378.8L472.6 379.3ZM471.8 391.8L471.7 391.6L471.7 378.6L471.8 378.8Z\"/><path class=\"iso-top\" d=\"M504.4 367.7L504.5 367.9L504.3 368.1L473.2 379.4L472.9 379.4L472.6 379.3L471.8 378.8L471.7 378.6L471.9 378.4L503 367.1L503.3 367.1L503.6 367.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M471.7 378.6L471.9 378.4L503 367.1L503.3 367.1L503.6 367.2L504.4 367.7L504.5 367.9M504.5 381L504.3 381.1L473.2 392.4L472.9 392.5L472.6 392.4L471.8 391.8L471.7 391.6M504.5 367.9L504.5 381M471.7 378.6L471.7 391.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M327.3 279.2L327.5 279.1L328.6 278.7L329 278.6L329.3 278.7L474.5 378.6L474.5 378.8L474.5 391.9L474.4 392L473.2 392.4L472.9 392.5L472.6 392.4L327.4 292.4L327.3 292.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M474.5 391.9L474.4 392L474.4 379L474.5 378.8ZM474.4 392L473.2 392.4L473.2 379.4L474.4 379Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M473.2 392.4L472.9 392.5L472.9 379.4L473.2 379.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M472.9 392.5L472.6 392.4L472.6 379.3L472.9 379.4ZM472.6 392.4L327.4 292.4L327.4 279.4L472.6 379.3ZM327.4 292.4L327.3 292.3L327.3 279.2L327.4 279.4Z\"/><path class=\"iso-top\" d=\"M474.5 378.6L474.5 378.8L474.4 379L473.2 379.4L472.9 379.4L472.6 379.3L327.4 279.4L327.3 279.2L327.5 279.1L328.6 278.7L329 278.6L329.3 278.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M474.5 378.8L474.4 379L473.2 379.4L472.9 379.4L472.6 379.3L327.4 279.4L327.3 279.2\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M474.5 378.8L474.1 378.8L473.1 379.2L472.9 379.2L472.8 379.2L327.7 279.3L327.3 279.2\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M474.5 387.8L474.4 388L473.2 388.4L472.9 388.4L472.6 388.3L327.4 288.4L327.3 288.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M327.3 279.2L327.5 279.1L328.6 278.7L329 278.6L329.3 278.7L474.5 378.6L474.5 378.8M474.5 391.9L474.4 392L473.2 392.4L472.9 392.5L472.6 392.4L327.4 292.4L327.3 292.3M474.5 378.8L474.5 391.9M327.3 279.2L327.3 292.3\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"331.2\" cy=\"286.5\" r=\"0.45\"/><circle cx=\"400\" cy=\"333.9\" r=\"0.45\"/><circle cx=\"468.8\" cy=\"381.2\" r=\"0.45\"/></g></svg>",
    tokens: {"legit":"<g class=\"bk-token\" data-kind=\"legit\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M279.7 241.1L279.8 240.5L280.1 239.9L280.8 239.3L281.7 238.9L282.8 238.6L284.1 238.4L285.3 238.5L286.5 238.6L287.6 239L288.5 239.4L289.1 240L289.4 240.6L289.4 243L289.4 243.6L289 244.3L288.4 244.8L287.4 245.2L286.3 245.5L285.1 245.7L283.8 245.7L282.6 245.5L281.5 245.2L280.6 244.7L280 244.1L279.7 243.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M289.4 243L289.4 243.6L289.4 241.2L289.4 240.6ZM289.4 243.6L289 244.3L289 241.8L289.4 241.2ZM289 244.3L288.4 244.8L288.4 242.4L289 241.8ZM288.4 244.8L287.4 245.2L287.4 242.8L288.4 242.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M287.4 245.2L286.3 245.5L286.3 243.1L287.4 242.8ZM286.3 245.5L285.1 245.7L285.1 243.3L286.3 243.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M285.1 245.7L283.8 245.7L283.8 243.3L285.1 243.3ZM283.8 245.7L282.6 245.5L282.6 243.1L283.8 243.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M282.6 245.5L281.5 245.2L281.5 242.7L282.6 243.1ZM281.5 245.2L280.6 244.7L280.6 242.3L281.5 242.7ZM280.6 244.7L280 244.1L280 241.7L280.6 242.3ZM280 244.1L279.7 243.5L279.7 241.1L280 241.7Z\"/><path class=\"iso-top\" d=\"M287.4 242.8L286.3 243.1L285.1 243.3L283.8 243.3L282.6 243.1L281.5 242.7L280.6 242.3L280 241.7L279.7 241.1L279.8 240.5L280.1 239.9L280.8 239.3L281.7 238.9L282.8 238.6L284.1 238.4L285.3 238.5L286.5 238.6L287.6 239L288.5 239.4L289.1 240L289.4 240.6L289.4 241.2L289 241.8L288.4 242.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M289.4 240.6L289.4 241.2L289 241.8L288.4 242.4L287.4 242.8L286.3 243.1L285.1 243.3L283.8 243.3L282.6 243.1L281.5 242.7L280.6 242.3L280 241.7L279.7 241.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M289.4 240.6L288.9 241.2L288.6 241.8L288 242.2L287.2 242.6L286.1 242.9L285 243L283.9 243L282.8 242.9L281.8 242.6L281 242.2L280.5 241.6L279.7 241.1\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M279.7 241.1L279.8 240.5L280.1 239.9L280.8 239.3L281.7 238.9L282.8 238.6L284.1 238.4L285.3 238.5L286.5 238.6L287.6 239L288.5 239.4L289.1 240L289.4 240.6M289.4 243L289.4 243.6L289 244.3L288.4 244.8L287.4 245.2L286.3 245.5L285.1 245.7L283.8 245.7L282.6 245.5L281.5 245.2L280.6 244.7L280 244.1L279.7 243.5M279.7 241.1L279.7 243.5M289.4 240.6L289.4 243\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M285.9 241.8L285.1 242L284.2 242L283.4 241.8L282.7 241.5L282.3 241.1L282.3 240.7L282.6 240.3L283.2 239.9L284 239.7L284.9 239.7L285.8 239.9L286.4 240.2L286.8 240.6L286.9 241L286.5 241.5Z\"/></g>","attack":"<g class=\"bk-token\" data-kind=\"attack\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M279.7 241.1L279.8 240.5L280.1 239.9L280.8 239.3L281.7 238.9L282.8 238.6L284.1 238.4L285.3 238.5L286.5 238.6L287.6 239L288.5 239.4L289.1 240L289.4 240.6L289.4 243L289.4 243.6L289 244.3L288.4 244.8L287.4 245.2L286.3 245.5L285.1 245.7L283.8 245.7L282.6 245.5L281.5 245.2L280.6 244.7L280 244.1L279.7 243.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M289.4 243L289.4 243.6L289.4 241.2L289.4 240.6ZM289.4 243.6L289 244.3L289 241.8L289.4 241.2ZM289 244.3L288.4 244.8L288.4 242.4L289 241.8ZM288.4 244.8L287.4 245.2L287.4 242.8L288.4 242.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M287.4 245.2L286.3 245.5L286.3 243.1L287.4 242.8ZM286.3 245.5L285.1 245.7L285.1 243.3L286.3 243.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M285.1 245.7L283.8 245.7L283.8 243.3L285.1 243.3ZM283.8 245.7L282.6 245.5L282.6 243.1L283.8 243.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M282.6 245.5L281.5 245.2L281.5 242.7L282.6 243.1ZM281.5 245.2L280.6 244.7L280.6 242.3L281.5 242.7ZM280.6 244.7L280 244.1L280 241.7L280.6 242.3ZM280 244.1L279.7 243.5L279.7 241.1L280 241.7Z\"/><path class=\"iso-top\" d=\"M287.4 242.8L286.3 243.1L285.1 243.3L283.8 243.3L282.6 243.1L281.5 242.7L280.6 242.3L280 241.7L279.7 241.1L279.8 240.5L280.1 239.9L280.8 239.3L281.7 238.9L282.8 238.6L284.1 238.4L285.3 238.5L286.5 238.6L287.6 239L288.5 239.4L289.1 240L289.4 240.6L289.4 241.2L289 241.8L288.4 242.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M289.4 240.6L289.4 241.2L289 241.8L288.4 242.4L287.4 242.8L286.3 243.1L285.1 243.3L283.8 243.3L282.6 243.1L281.5 242.7L280.6 242.3L280 241.7L279.7 241.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M289.4 240.6L288.9 241.2L288.6 241.8L288 242.2L287.2 242.6L286.1 242.9L285 243L283.9 243L282.8 242.9L281.8 242.6L281 242.2L280.5 241.6L279.7 241.1\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M279.7 241.1L279.8 240.5L280.1 239.9L280.8 239.3L281.7 238.9L282.8 238.6L284.1 238.4L285.3 238.5L286.5 238.6L287.6 239L288.5 239.4L289.1 240L289.4 240.6M289.4 243L289.4 243.6L289 244.3L288.4 244.8L287.4 245.2L286.3 245.5L285.1 245.7L283.8 245.7L282.6 245.5L281.5 245.2L280.6 244.7L280 244.1L279.7 243.5M279.7 241.1L279.7 243.5M289.4 240.6L289.4 243\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M285.9 241.8L285.1 242L284.2 242L283.4 241.8L282.7 241.5L282.3 241.1L282.3 240.7L282.6 240.3L283.2 239.9L284 239.7L284.9 239.7L285.8 239.9L286.4 240.2L286.8 240.6L286.9 241L286.5 241.5Z\"/></g>"},
    geom: {"P":{"origin":[284.57040809728767,243.26421591738716],"scale":0.9159587493835072,"azimuth":36,"elevation":30},"COLS":10,"ROWS":10,"FRONT":10,"PITCH_X":11.6,"PITCH_Z":12.9,"GRID":{"x0":-50,"x1":66,"z0":19,"z1":148},"BELT_Y":-40,"BELT_W":24,"BELT_Z":44,"BELT":{"x0":76,"x1":336},"MOUTH_X":72,"GATE_X":81,"HOPPER_X":312,"SIEVE_X":262,"TURN_X":212,"PRESS_X":158,"TRAY":{"x":90,"y":-14,"w":214,"d":34,"r":3},"TRAY_H":13,"LANES":[81,158,212,262],"GAUGE":{"at":[-14,-25],"r":20,"z":170.2,"from":-2.356194490192345,"span":4.71238898038469},"TIMER":{"at":[44,-25],"r":10,"z":169.2},"TURN":{"x":212,"y":-40,"z":45,"h":11,"r":10},"PRESS":{"x":158,"y":-40,"rest":62,"stroke":15},"SIEVE_LIFT":24,"TURN_LIFT":22,"GATE_LIFT":17,"TOKEN_R":4.2,"TOKEN_H":2.4},
    slots: [{"x":-44.2,"z":19},{"x":-32.6,"z":19},{"x":-21,"z":19},{"x":-9.399999999999999,"z":19},{"x":2.1999999999999957,"z":19},{"x":13.799999999999997,"z":19},{"x":25.39999999999999,"z":19},{"x":37,"z":19},{"x":48.599999999999994,"z":19},{"x":60.2,"z":19},{"x":-44.2,"z":31.9},{"x":-32.6,"z":31.9},{"x":-21,"z":31.9},{"x":-9.399999999999999,"z":31.9},{"x":2.1999999999999957,"z":31.9},{"x":13.799999999999997,"z":31.9},{"x":25.39999999999999,"z":31.9},{"x":37,"z":31.9},{"x":48.599999999999994,"z":31.9},{"x":60.2,"z":31.9},{"x":-44.2,"z":44.8},{"x":-32.6,"z":44.8},{"x":-21,"z":44.8},{"x":-9.399999999999999,"z":44.8},{"x":2.1999999999999957,"z":44.8},{"x":13.799999999999997,"z":44.8},{"x":25.39999999999999,"z":44.8},{"x":37,"z":44.8},{"x":48.599999999999994,"z":44.8},{"x":60.2,"z":44.8},{"x":-44.2,"z":57.7},{"x":-32.6,"z":57.7},{"x":-21,"z":57.7},{"x":-9.399999999999999,"z":57.7},{"x":2.1999999999999957,"z":57.7},{"x":13.799999999999997,"z":57.7},{"x":25.39999999999999,"z":57.7},{"x":37,"z":57.7},{"x":48.599999999999994,"z":57.7},{"x":60.2,"z":57.7},{"x":-44.2,"z":70.6},{"x":-32.6,"z":70.6},{"x":-21,"z":70.6},{"x":-9.399999999999999,"z":70.6},{"x":2.1999999999999957,"z":70.6},{"x":13.799999999999997,"z":70.6},{"x":25.39999999999999,"z":70.6},{"x":37,"z":70.6},{"x":48.599999999999994,"z":70.6},{"x":60.2,"z":70.6},{"x":-44.2,"z":83.5},{"x":-32.6,"z":83.5},{"x":-21,"z":83.5},{"x":-9.399999999999999,"z":83.5},{"x":2.1999999999999957,"z":83.5},{"x":13.799999999999997,"z":83.5},{"x":25.39999999999999,"z":83.5},{"x":37,"z":83.5},{"x":48.599999999999994,"z":83.5},{"x":60.2,"z":83.5},{"x":-44.2,"z":96.4},{"x":-32.6,"z":96.4},{"x":-21,"z":96.4},{"x":-9.399999999999999,"z":96.4},{"x":2.1999999999999957,"z":96.4},{"x":13.799999999999997,"z":96.4},{"x":25.39999999999999,"z":96.4},{"x":37,"z":96.4},{"x":48.599999999999994,"z":96.4},{"x":60.2,"z":96.4},{"x":-44.2,"z":109.3},{"x":-32.6,"z":109.3},{"x":-21,"z":109.3},{"x":-9.399999999999999,"z":109.3},{"x":2.1999999999999957,"z":109.3},{"x":13.799999999999997,"z":109.3},{"x":25.39999999999999,"z":109.3},{"x":37,"z":109.3},{"x":48.599999999999994,"z":109.3},{"x":60.2,"z":109.3},{"x":-44.2,"z":122.2},{"x":-32.6,"z":122.2},{"x":-21,"z":122.2},{"x":-9.399999999999999,"z":122.2},{"x":2.1999999999999957,"z":122.2},{"x":13.799999999999997,"z":122.2},{"x":25.39999999999999,"z":122.2},{"x":37,"z":122.2},{"x":48.599999999999994,"z":122.2},{"x":60.2,"z":122.2},{"x":-44.2,"z":135.10000000000002},{"x":-32.6,"z":135.10000000000002},{"x":-21,"z":135.10000000000002},{"x":-9.399999999999999,"z":135.10000000000002},{"x":2.1999999999999957,"z":135.10000000000002},{"x":13.799999999999997,"z":135.10000000000002},{"x":25.39999999999999,"z":135.10000000000002},{"x":37,"z":135.10000000000002},{"x":48.599999999999994,"z":135.10000000000002},{"x":60.2,"z":135.10000000000002}]
  };
})(window.Lab);

/* ===== js/backlog.js ===== */
/* ==========================================================================
   backlog.js — OWNER: Manvith Karkera
   Purpose: the live "backlog machine" figure (Lab.Backlog). The static art is
   generated into backlog-art.js by tools/backlog/build.mjs; this file only
   moves it, driven by the engine's public events (CONTRACT §5.2):

   - tick:   tags on the 100 hooks follow state.queue (legit / attack), the
             gauge needle follows queueUtil, the gate drops when the queue is
             full, the stations follow state.mitigation.
   - packet: each SYN becomes a token that drops from the hopper and rides the
             belt to where its outcome happens: into the cabinet (queued /
             completed), against the closed gate (rejected), against the
             firewall screen or the turnstile (filtered), or under the stamp
             press and back out (cookie).

   One requestAnimationFrame loop, stopped when the figure is offscreen or at
   rest. Under prefers-reduced-motion nothing travels: tags, gauge, gate and
   stations jump straight to the model's values.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var MAX_TOKENS = 48;
  var BELT_SPEED = 170;        // world units per second
  var DROP_MS = 260;           // hopper -> belt
  var FALL_MS = 420;           // belt -> reject tray
  var TRAY_KEEP_MS = 2600;     // tokens rest in the tray this long, then fade
  var FADE_MS = 360;

  var MIT_INPUTS = { synCookies: 'mit-syn-cookies', rateLimit: 'mit-rate-limit', shortTimeout: 'mit-short-timeout', firewall: 'mit-firewall' };
  var NO_MIT = { synCookies: false, rateLimit: false, shortTimeout: false, firewall: false };

  var art, G, I, P;
  var root = null, svg = null, readoutEl = null, lanes = {}, tagEls = [], needle, hand, gate, sieve, turnstile, paddles, ram, slats;
  var slots = [];              // 'free' | 'legit' | 'attack' per hook
  var ages = [];               // when each hook was filled, to clear the oldest first
  var tokens = [];
  var unsubs = [];
  var model = { util: 0, pending: 0, capacity: 100, running: false, state: 'Healthy', mit: NO_MIT, timeout: 30 };
  var shown = { util: 0, utilRate: 0, gate: 1, sieve: 1, turn: 1, timer: 30, spin: 0, ram: 0, belt: 0 };
  var frame = 0, last = 0, visible = true, filler = 0;

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function follow(cur, target, dt, sec) { return cur + (target - cur) * (1 - Math.exp(-dt / sec)); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function el(sel) { return svg.querySelector(sel); }

  // ---- markup -----------------------------------------------------------------
  function mount(container) {
    root = document.createElement('figure');
    root.className = 'backlog iso';
    root.setAttribute('data-theme', 'light');   // the kit's paper inks; the lab has one light theme
    root.innerHTML =
      '<div class="backlog__plate">' +
        '<div class="backlog__corners" aria-hidden="true">' +
          '<span data-corner="fig">Fig 1</span><span data-corner="title">Inside the queue</span>' +
        '</div>' +
        '<div class="backlog__stage">' + art.svg + '</div>' +
        '<div class="backlog__foot">' +
          '<span class="backlog__hint">100 hooks = 100 half-open slots</span>' +
          '<span class="backlog__readout" data-readout aria-live="off">0 / 100 hooks · gate open</span>' +
        '</div>' +
      '</div>' +
      '<figcaption class="backlog__legend">' +
        '<span class="backlog__key"><i class="backlog__swatch backlog__swatch--legit"></i>Real client</span>' +
        '<span class="backlog__key"><i class="backlog__swatch backlog__swatch--attack"></i>Spoofed attack SYN</span>' +
        '<span class="backlog__key"><i class="backlog__swatch backlog__swatch--cookie"></i>Answered with a SYN cookie</span>' +
        '<span class="backlog__caption">Each SYN that gets in hangs a tag on a free hook. A real client takes its tag back after its ACK; a spoofed tag hangs until the timer on top clears it. When all 100 hooks are full the gate drops and new connections fall into the reject tray. Switch defences on and the firewall screen, the rate-limit turnstile and the SYN-cookie press come down over the belt.</span>' +
      '</figcaption>';
    container.appendChild(root);
    svg = root.querySelector('svg');
    readoutEl = root.querySelector('[data-readout]');
    var laneEls = svg.querySelectorAll('[data-part="lane"]');
    for (var i = 0; i < laneEls.length; i++) lanes[laneEls[i].getAttribute('data-lane')] = laneEls[i];
    tagEls = [];
    var tagNodes = svg.querySelectorAll('.bk-tag');
    for (i = 0; i < tagNodes.length; i++) tagEls[+tagNodes[i].getAttribute('data-slot')] = tagNodes[i];
    needle = el('.bk-needle'); hand = el('.bk-hand');
    gate = el('[data-part="gate"]'); sieve = el('[data-part="sieve"]'); turnstile = el('[data-part="turnstile"]');
    paddles = el('[data-part="paddles"]'); ram = el('[data-part="ram"]'); slats = el('.bk-slats');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) kick();
      }, { rootMargin: '120px 0px' }).observe(root);
    }
  }

  // ---- hooks -------------------------------------------------------------------
  function setSlot(i, kind) {
    slots[i] = kind;
    ages[i] = kind === 'free' ? 0 : ++filler;
    tagEls[i].setAttribute('data-kind', kind);
  }
  function syncHooks(legit, attack) {
    var have = { legit: 0, attack: 0 }, i;
    for (i = 0; i < slots.length; i++) if (slots[i] !== 'free') have[slots[i]]++;
    ['legit', 'attack'].forEach(function (kind) {
      var want = kind === 'legit' ? legit : attack;
      while (have[kind] > want) {                     // clear the oldest tag of this kind
        var oldest = -1;
        for (i = 0; i < slots.length; i++) if (slots[i] === kind && (oldest < 0 || ages[i] < ages[oldest])) oldest = i;
        setSlot(oldest, 'free'); have[kind]--;
      }
    });
    ['attack', 'legit'].forEach(function (kind) {
      var want = kind === 'legit' ? legit : attack;
      while (have[kind] < want) {                     // hang new tags on the lowest free hooks
        var free = slots.indexOf('free');
        if (free < 0) return;
        setSlot(free, kind); have[kind]++;
      }
    });
  }

  // ---- model in ----------------------------------------------------------------
  function mitigationNow(state) {
    if (state && state.running) return state.mitigation;
    var m = {}, any = false;
    for (var key in MIT_INPUTS) {
      var box = document.getElementById(MIT_INPUTS[key]);
      m[key] = !!(box && box.checked);
      if (box) any = true;
    }
    return any ? m : (state ? state.mitigation : NO_MIT);
  }

  function onTick(state) {
    model.capacity = state.queue.capacity;
    model.pending = state.metrics.pending;
    model.util = state.metrics.queueUtil;
    model.running = state.running;
    model.state = state.serverState;
    model.mit = mitigationNow(state);
    model.timeout = model.mit.shortTimeout ? state.params.shortTimeoutSec : state.params.timeoutSec;
    syncHooks(Math.round(state.queue.legit), Math.round(state.queue.attack));
    writeReadout();
    kick();
  }

  function writeReadout() {
    if (!readoutEl) return;
    var full = model.pending >= model.capacity;
    var text = model.pending + ' / ' + model.capacity + ' hooks · ' + (full ? (model.mit.synCookies ? 'full, stamping cookies' : 'gate shut') : 'gate open');
    if (readoutEl.textContent !== text) readoutEl.textContent = text;
  }

  // ---- tokens --------------------------------------------------------------------
  // a token's plan is a list of legs: { to: [x, y, z], ms, lane?, then? }
  function laneFor(x) {
    var L = G.LANES;                                  // [gate, press, turnstile, sieve] x positions
    if (x < L[0]) return '0';
    if (x < L[1]) return '1';
    if (x < L[2]) return '2';
    if (x < L[3]) return '3';
    return '4';
  }
  function travel(fromX, toX) { return Math.abs(toX - fromX) / BELT_SPEED * 1000; }

  function planFor(evt) {
    var y = G.BELT_Y, z = G.BELT_Z, start = G.HOPPER_X;
    var legs = [{ to: [start, y, z], ms: DROP_MS }];
    var trayY = G.TRAY.y + G.TRAY.d / 2, trayZ = 2.2;
    function fallAt(x) {
      legs.push({ to: [x, y + G.BELT_W / 2 + 4, z + 2], ms: 160 });
      legs.push({ to: [clamp(x, G.TRAY.x + 8, G.TRAY.x + G.TRAY.w - 8), trayY + (Math.random() - 0.5) * 18, trayZ], ms: FALL_MS, lane: 'tray' });
      legs.push({ ms: TRAY_KEEP_MS, hold: true });
      legs.push({ ms: FADE_MS, fade: true });
    }
    switch (evt.outcome) {
      case 'queued':
      case 'completed': {
        var mouth = G.MOUTH_X + 4;
        legs.push({ to: [mouth, y, z], ms: travel(start, mouth) });
        legs.push({ to: [G.MOUTH_X - 6, y, z], ms: 180, fade: true });
        break;
      }
      case 'rejected': {
        var stop = G.GATE_X + G.TOKEN_R + 1.5;
        legs.push({ to: [stop, y, z], ms: travel(start, stop) });
        fallAt(stop);
        break;
      }
      case 'filtered': {
        var bySieve = model.mit.firewall && (!model.mit.rateLimit || Math.random() < 0.6);
        var at = bySieve ? G.SIEVE_X + G.TOKEN_R + 2 : G.TURN_X + G.TURN.r + G.TOKEN_R;
        legs.push({ to: [at, y, z], ms: travel(start, at) });
        fallAt(at);
        break;
      }
      case 'cookie': {
        var under = G.PRESS_X;
        legs.push({ to: [under, y, z], ms: travel(start, under) });
        legs.push({ ms: 260, hold: true, stamp: true });
        legs.push({ to: [G.BELT.x1 - 6, y, z], ms: travel(under, G.BELT.x1 - 6) });
        legs.push({ ms: FADE_MS, fade: true });
        break;
      }
      default:
        return null;
    }
    return legs;
  }

  function onPacket(evt) {
    if (reducedMotion() || !visible || document.hidden) return;
    if (evt.type !== 'syn' && !(evt.type === 'ack' && evt.outcome === 'completed')) return;
    var legs = planFor(evt);
    if (!legs) return;
    if (tokens.length >= MAX_TOKENS) removeToken(0);
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = art.tokens[evt.source === 'legit' ? 'legit' : 'attack'];
    g = g.firstChild;
    var t = { el: g, pos: [G.HOPPER_X, G.BELT_Y, G.BELT_Z + 52], from: null, legs: legs, leg: -1, started: 0, lane: null, alpha: 1 };
    tokens.push(t);
    nextLeg(t, performance.now());
    placeToken(t);
    kick();
  }

  function nextLeg(t, now) {
    t.leg++;
    t.started = now;
    t.from = t.pos.slice();
    var leg = t.legs[t.leg];
    if (leg && leg.stamp) { shown.ram = 1; t.el.setAttribute('data-kind', 'cookie'); }
  }

  function placeToken(t) {
    var leg = t.legs[t.leg];
    var lane = (leg && leg.lane) || (t.lane === 'tray' ? 'tray' : laneFor(t.pos[0]));
    if (lane !== t.lane) { lanes[lane].appendChild(t.el); t.lane = lane; }
    t.el.setAttribute('transform', I.translateAlong(P, t.pos));
    if (t.alpha < 1) t.el.setAttribute('opacity', t.alpha.toFixed(2));
  }

  function removeToken(index) {
    var t = tokens[index];
    if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
    tokens.splice(index, 1);
  }

  function stepTokens(now) {
    for (var i = tokens.length - 1; i >= 0; i--) {
      var t = tokens[i];
      var leg = t.legs[t.leg];
      while (leg && now - t.started >= leg.ms) {
        if (leg.to) t.pos = leg.to.slice();
        if (leg.fade) { removeToken(i); leg = null; t = null; break; }
        nextLeg(t, t.started + leg.ms);
        leg = t.legs[t.leg];
      }
      if (!t) continue;
      if (!leg) { removeToken(i); continue; }
      var k = clamp((now - t.started) / leg.ms, 0, 1);
      if (leg.to) {
        var e = leg.lane === 'tray' ? k * k : k;     // falling accelerates, the belt runs steady
        for (var a = 0; a < 3; a++) t.pos[a] = t.from[a] + (leg.to[a] - t.from[a]) * e;
      }
      t.alpha = leg.fade ? 1 - k : 1;
      placeToken(t);
    }
  }

  // ---- parts ---------------------------------------------------------------------
  function needlePath(value) {
    var g = G.GAUGE, a = g.from + g.span * clamp(value, 0, 100) / 100;
    var cx = g.at[0], cy = g.at[1];
    return I.lineOnTop([cx - Math.sin(a) * 4, cy + Math.cos(a) * 4], [cx + Math.sin(a) * g.r, cy - Math.cos(a) * g.r], g.z, P);
  }
  function handPath(seconds) {
    var g = G.TIMER, a = (seconds / 30) * Math.PI * 2;
    var cx = g.at[0], cy = g.at[1];
    return I.lineOnTop([cx - Math.sin(a) * 2, cy + Math.cos(a) * 2], [cx + Math.sin(a) * g.r, cy - Math.cos(a) * g.r], g.z, P);
  }
  function paddleSvg(spin) {
    var T = G.TURN, list = [];
    for (var n = 0; n < 4; n++) {
      var a = spin + n * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a), w = 0.9;
      var r0 = 3, r1 = T.r;
      var ring = [
        [T.x + ca * r0 - sa * w, T.y + sa * r0 + ca * w], [T.x + ca * r1 - sa * w, T.y + sa * r1 + ca * w],
        [T.x + ca * r1 + sa * w, T.y + sa * r1 - ca * w], [T.x + ca * r0 + sa * w, T.y + sa * r0 - ca * w]
      ];
      list.push({ depth: I.depthOf([T.x + ca * r1 / 2, T.y + sa * r1 / 2, T.z], P), svg: I.solidSvg(I.extrude(ring, T.z, T.h, P), { tone: 'hi', crease: 'lo' }) });
    }
    list.sort(function (p, q) { return p.depth - q.depth; });
    return list.map(function (p) { return p.svg; }).join('');
  }

  function drawParts() {
    needle.setAttribute('d', needlePath(shown.util));
    hand.setAttribute('d', handPath(shown.timer));
    gate.setAttribute('transform', I.translateAlong(P, [0, 0, shown.gate * G.GATE_LIFT]));
    if (shown.gate < 0.5) gate.setAttribute('data-shut', ''); else gate.removeAttribute('data-shut');
    sieve.setAttribute('transform', I.translateAlong(P, [0, 0, shown.sieve * G.SIEVE_LIFT]));
    turnstile.setAttribute('transform', I.translateAlong(P, [0, 0, shown.turn * G.TURN_LIFT]));
    paddles.innerHTML = paddleSvg(shown.spin);
    ram.setAttribute('transform', I.translateAlong(P, [0, 0, -shown.ram * G.PRESS.stroke]));
    slats.setAttribute('transform', I.translateAlong(P, [-(shown.belt % 8), 0, 0]));
  }

  // ---- loop ----------------------------------------------------------------------
  function targets() {
    return {
      util: model.util,
      gate: model.pending >= model.capacity ? 0 : 1,
      sieve: model.mit.firewall ? 0 : 1,
      turn: model.mit.rateLimit ? 0 : 1,
      timer: model.timeout
    };
  }

  function tick(now) {
    var dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
    last = now;
    var want = targets();
    if (reducedMotion()) {
      shown.util = want.util; shown.gate = want.gate; shown.sieve = want.sieve; shown.turn = want.turn; shown.timer = want.timer; shown.ram = 0;
    } else {
      // the needle on a damped spring, everything else eased
      for (var s = 0; s < 4; s++) {
        shown.utilRate += ((want.util - shown.util) * 90 - shown.utilRate * 14) * dt / 4;
        shown.util += shown.utilRate * dt / 4;
      }
      shown.gate = follow(shown.gate, want.gate, dt, 0.09);
      shown.sieve = follow(shown.sieve, want.sieve, dt, 0.25);
      shown.turn = follow(shown.turn, want.turn, dt, 0.25);
      shown.timer = follow(shown.timer, want.timer, dt, 0.3);
      shown.ram = follow(shown.ram, 0, dt, 0.12);
      if (model.running) {
        shown.belt += BELT_SPEED * dt;
        if (model.mit.rateLimit) shown.spin += dt * 2.4;
      }
      stepTokens(now);
    }
    drawParts();
    var settled = !model.running && !tokens.length &&
      Math.abs(shown.util - want.util) < 0.05 && Math.abs(shown.utilRate) < 0.05 &&
      Math.abs(shown.gate - want.gate) < 0.002 && Math.abs(shown.sieve - want.sieve) < 0.002 &&
      Math.abs(shown.turn - want.turn) < 0.002 && Math.abs(shown.timer - want.timer) < 0.02 && shown.ram < 0.002;
    frame = visible && !settled ? requestAnimationFrame(tick) : 0;
  }

  function kick() {
    if (!frame && visible && root) { last = 0; frame = requestAnimationFrame(tick); }
  }

  // idle: the mitigation switches can change between runs (the terminal flips them)
  function watchSwitches() {
    var boxes = [];
    for (var key in MIT_INPUTS) { var b = document.getElementById(MIT_INPUTS[key]); if (b) boxes.push(b); }
    setInterval(function () {
      if (model.running || !root) return;
      var m = mitigationNow(null), changed = false;
      for (var key in m) if (m[key] !== model.mit[key]) changed = true;
      if (changed) { model.mit = m; model.timeout = m.shortTimeout ? 5 : 30; writeReadout(); kick(); }
    }, 400);
    return boxes;
  }

  // ---- public ----------------------------------------------------------------------
  Lab.Backlog = {
    init: function (engine, container) {
      art = Lab.BacklogArt; I = Lab.Iso;
      if (!art || !I || !container) return;
      unsubs.forEach(function (u) { u(); });
      unsubs = [];
      if (!root) {
        G = art.geom; P = G.P;
        for (var i = 0; i < G.COLS * G.ROWS; i++) { slots[i] = 'free'; ages[i] = 0; }
        mount(container);
        watchSwitches();
      } else {
        Lab.Backlog.reset();
      }
      unsubs.push(engine.on('tick', onTick));
      unsubs.push(engine.on('packet', onPacket));
      var s = engine.getState();
      model.capacity = s.queue.capacity;
      model.mit = mitigationNow(s);
      model.timeout = model.mit.shortTimeout ? s.params.shortTimeoutSec : s.params.timeoutSec;
      shown.timer = model.timeout;
      writeReadout();
      drawParts();
      kick();
    },
    reset: function () {
      if (!root) return;
      while (tokens.length) removeToken(0);
      for (var i = 0; i < slots.length; i++) if (slots[i] !== 'free') setSlot(i, 'free');
      model.util = 0; model.pending = 0; model.running = false;
      writeReadout();
      kick();
    }
  };
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
    var done = make('g', { opacity: 0, role: 'img', 'aria-label': 'Connection established' }, s);
    if (Lab.Icons && Lab.Icons.check) placeIcon(done, Lab.Icons.check, 142, 126, 22);
    make('text', { x: 166, y: 143, 'font-size': 15, 'font-weight': 700, 'font-family': 'var(--font-sans)', fill: 'var(--color-healthy)' }, done).textContent = 'Connection established';
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

      // The backlog machine (Lab.Backlog, backlog.js) sits under the topology diagram.
      if (Lab.Backlog && engine && engine.on) Lab.Backlog.init(engine, document.getElementById('topology'));

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
      if (Lab.Backlog) Lab.Backlog.reset();
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
          span.textContent = ' ';
          var trendIcon = Lab.Icons && Lab.Icons.element(up ? 'arrowUp' : 'arrowDown', 'metric-delta__icon');
          if (trendIcon) span.appendChild(trendIcon);
          span.appendChild(document.createTextNode(' ' + fmt(Math.abs(diff)) + row.unit));
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
        if (tick) { tick.textContent = ''; if (tasksDone[t.id] && Lab.Icons) tick.appendChild(Lab.Icons.element('check')); }
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
    ev.notes.forEach(function (n) {
      var li = el('li', 'ws-notes__' + n.level);
      var iconName = { good: 'check', warn: 'warning', bad: 'cross', info: 'info' }[n.level];
      var iconWrap = el('span', 'ws-notes__icon');
      if (Lab.Icons && iconName) iconWrap.appendChild(Lab.Icons.element(iconName));
      li.appendChild(iconWrap);
      li.appendChild(document.createTextNode(' ' + n.text));
      ul.appendChild(li);
    });
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
      if (tick) { tick.textContent = ''; if (ok && Lab.Icons) tick.appendChild(Lab.Icons.element('check')); }
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
      if (guideDone[st.id] && Lab.Icons && Lab.Icons.element) li.appendChild(Lab.Icons.element('check', 'term-guide__check'));
      li.appendChild(document.createTextNode(st.title + (st.required ? '' : ' (bonus)')));
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

    var acknowledged = !!($('ack-checkbox') && $('ack-checkbox').checked);
    setDisabled('btn-start', !acknowledged);
    setDisabled('btn-next-workspace', !acknowledged);
    setDisabled('btn-baseline', !(started && !running && cur === 2));
    setDisabled('btn-start-flood', !attackAllowed);
    setDisabled('attack-level', !attackAllowed);
    setDisabled('btn-stop-sim', !running);
    setDisabled('btn-stop', !running);
    if ($('btn-stop')) $('btn-stop').hidden = !running;
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
    updateProgressNav(cur);
  }

  function updateProgressNav(cur) {
    var nav = $('lab-progress');
    if (!nav) return;
    var active = !started ? 0 : (cur <= 5 ? 1 : (cur <= 7 ? 2 : 3));
    var stages = nav.querySelectorAll('[data-stage]');
    stages.forEach(function (item, index) {
      var state = index < active ? 'complete' : (index === active ? 'current' : 'upcoming');
      item.dataset.state = state;
      if (state === 'current') item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
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
    if (!$('ack-checkbox') || !$('ack-checkbox').checked) return;
    started = true;
    show($('screen-guidelines'), false);
    LAB_SECTIONS.forEach(function (id) { show($(id), true); });
    show($('section-theory'), false);
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
    if (!started) { show($('screen-guidelines'), true); scrollToEl($('screen-guidelines')); focusEl($('guidelines-heading')); }
    else { scrollToEl($('stepper-section')); focusEl($('step-title')); }
  }

  function continueToTheory() {
    if (!$('ack-checkbox') || !$('ack-checkbox').checked) return;
    show($('screen-guidelines'), false);
    openTheory();
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
    $('btn-start').addEventListener('click', continueToTheory);
    $('btn-next-workspace').addEventListener('click', startLab);
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
