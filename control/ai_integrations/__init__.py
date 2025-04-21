from .ai_core import EnhancedASECNAICore
from .interpreter_config import ASECNInterpreter
from .autogen_config import create_agents, initialize_workflow, start_group_chat

__all__ = [
    'EnhancedASECNAICore',
    'ASECNInterpreter',
    'create_agents',
    'initialize_workflow',
    'start_group_chat'
]

async def initialize_ai_systems():
    """Initialize the ASECN AI Core with all subsystems"""
    core = EnhancedASECNAICore()
    
    # Start continuous monitoring in background
    import asyncio
    asyncio.create_task(core.run_continuous_monitoring())
    
    return core

# Example usage:
"""
import asyncio
from ai_integrations import initialize_ai_systems

async def main():
    ai_core = await initialize_ai_systems()
    
    # Execute a task
    result = await ai_core.execute_task(
        "Analyze current memory state and optimize storage",
        workflow_name="memory_analysis"
    )
    
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
"""