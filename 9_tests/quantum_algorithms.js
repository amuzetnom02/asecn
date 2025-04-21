import pytest
import numpy as np
from ai_core import EnhancedASECNAICore, QuantumState

def test_initialize_quantum_state():
    core = EnhancedASECNAICore()
    state = core._initialize_quantum_state()
    assert state.amplitude == complex(1.0, 0.0)
    assert state.phase == 0.0
    assert state.entanglement_pairs == []

def test_apply_quantum_interference():
    core = EnhancedASECNAICore()
    states = [
        QuantumState(amplitude=complex(1,0), phase=0.0, entanglement_pairs=[]),
        QuantumState(amplitude=complex(2,0), phase=np.pi, entanglement_pairs=[])
    ]
    result = core._apply_quantum_interference(states)
    expected_amplitude = (complex(1,0) + complex(2,0)) / np.sqrt(2)
    expected_phase = np.mean([0.0, np.pi])
    assert np.isclose(result.amplitude.real, expected_amplitude.real)
    assert np.isclose(result.phase, expected_phase)

@pytest.mark.asyncio
async def test_quantum_workflow_selection():
    core = EnhancedASECNAICore()
    # Should select 'memory_analysis'
    workflow = await core._quantum_workflow_selection("Recall memory state")
    assert workflow == "memory_analysis"
    # Should select 'action_execution'
    workflow = await core._quantum_workflow_selection("Deploy contract and transfer funds")
    assert workflow == "action_execution"

def test_get_quantum_metrics():
    core = EnhancedASECNAICore()
    state = QuantumState(amplitude=complex(3,4), phase=1.5, entanglement_pairs=[(1,2)])
    metrics = core._get_quantum_metrics(state)
    assert metrics["amplitude"] == 5.0  # abs(3+4j)
    assert metrics["phase"] == 1.5
    assert metrics["entanglement_count"] == 1

def test_calculate_adaptive_sleep():
    core = EnhancedASECNAICore()
    state = QuantumState(amplitude=complex(1,0), phase=0.0, entanglement_pairs=[])
    sleep = core._calculate_adaptive_sleep(state)
    assert np.isclose(sleep, 600.0)
    state = QuantumState(amplitude=complex(0,0), phase=0.0, entanglement_pairs=[])
    sleep = core._calculate_adaptive_sleep(state)
    assert np.isclose(sleep, 300.0)