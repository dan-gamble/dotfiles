## This machine

- Dan works and takes calls on this machine, so never load it on purpose. No CPU burners (`yes`, `stress`), no `taskset` pinning, no parallel copies of a test run, and no loops of more than three runs. Run one full suite at a time. To reproduce a flake under load, ask Dan first or do it on CI.
