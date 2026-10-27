# Objectives

After completing this lab, the student will be able to:

1. Explain the TCP three-way handshake (SYN, SYN-ACK, ACK) and what a half-open connection is.
2. Describe how a SYN flood exhausts the server's backlog queue of half-open connections and denies service to legitimate users without breaking into the server.
3. Tell legitimate traffic and attack traffic apart: both start with a SYN, but legitimate clients complete the handshake while most attack SYNs never send the final ACK.
4. Measure service availability, queue utilisation, CPU usage and response time during an attack and compare them against a healthy baseline.
5. Configure Linux defences on a simulated server using `sysctl` (`tcp_syncookies`, `tcp_synack_retries`, `tcp_max_syn_backlog`) and `iptables` rate limits, and verify their effect against the same attack.
6. State the limitation of each defence and explain why defence in depth is needed, since no single defence gives 100% protection.
7. Follow a defender's workflow: measure, investigate the evidence, mitigate, make the changes permanent and verify from the customer's side.
