# Procedure

## A. Open the lab

1. Open `index.html` in a modern browser (Chrome, Edge, Firefox or Safari). It runs straight from the file system, so no server or internet connection is needed. The built three-file version in `dist/index.html` works the same way.

## B. Guidelines and theory

2. On the **Before You Begin** screen, read the objective, the disclaimer and the nine guidelines.
3. Tick **I have read and understood the guidelines**, then press **Continue to Theory**. (You can also press **View Theory** to read the theory first.)
4. Read the theory: TCP, the three-way handshake, the SYN flood, availability and the pizza-shop analogy. Press **Replay handshake** to watch SYN, SYN-ACK and ACK travel between client and server.
5. Press **Next: Experiment Workspace**. The theory can be reopened at any time with the **Theory** button in the header.

## C. The nine experiment steps

Each step unlocks when the previous one is finished. The current step's instructions are shown in the **Experiment Steps** panel.

6. **Step 1: Review the lab.** Read the theory and press **Replay handshake**. Click each part of the network diagram (Legitimate Client, Simulated Traffic Generator, Target Server, TCP Connection Queue, Network Status Indicator) to see what it does. Press **Continue**.

7. **Step 2: Generate baseline traffic.** Press **Generate Baseline Traffic**. Watch legitimate clients complete handshakes; the server stays **Healthy** and the queue stays almost empty. The baseline runs for 20 simulated seconds and is saved for the comparison later.

8. **Step 3: Launch the SYN flood.** Choose an **Attack level** (Low, Medium or High) and press **Start SYN Flood**. The traffic generator now sends SYN messages that never complete. You may try each level in turn; each run replaces the previous attack.

9. **Step 4: Observe the impact.** Watch the queue fill with attack slots. On the **Live Dashboard**, pending connections, CPU and response time rise, then availability falls. Note when the server becomes **Degraded** or **Unavailable**, and check the **Experiment Log**.

10. **Step 5: Stop the attack.** Press **Stop Simulation** (or **Stop** in the header) when you have seen enough, or let the run finish after 40 simulated seconds. Every number stays on screen.

11. **Step 6: Enable mitigation.** The terminal opens automatically (it can also be opened with the **Terminal** button, **Open the terminal**, or Ctrl+`). You are root on the simulated server `web01`. Type `help` to see the supported commands, and follow the **Guided runbook** (press **Put it in the prompt** to copy each command). The four switches in the **Mitigation** section (SYN cookies, Rate limiting, Shorter timeouts, Firewall filtering) follow your configuration. When at least one is on, press **Run With Mitigation** to replay the same attack against your configuration.

12. **Step 7: Compare the results.** Study the **Comparison** table (baseline vs attack vs mitigated) and the explanation under it. Decide which numbers improved most and which stayed bad. Press **Continue**.

13. **Step 8: Defender's workshop.** Work through the five modules: **Understand**, **Investigate**, **Harden**, **Choose layers** and **Run the incident**. When all five are done, press **Finish the workshop and continue to the quiz**.

14. **Step 9: Test your knowledge.** Answer the quiz questions one at a time: select an option, press **Submit**, read the feedback, then press **Next**. Your score is shown at the end.

## D. Completion

15. When the baseline, attack and mitigated runs, the workshop and the quiz are all done, the completion summary appears with your availability results and quiz score. Press **Review Results** to go back to your results, **🎓 Get Certificate** to give optional feedback and generate a certificate, or **Restart Lab** to start again.

## E. Reset

16. To start again at any point, open **Lab menu** in the header:
    - **Reset current run** clears your results, the log and quiz progress and returns you to Step 1.
    - **Restart lab** goes back to the very beginning.

    If you already have results, you are asked to confirm first.
