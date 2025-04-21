import asyncio
import sys
import os
from pathlib import Path
from ai_integrations import EnhancedASECNAICore
import interpreter
from rich.console import Console
from rich.panel import Panel

console = Console()

async def test_interpreter():
    """Test Open Interpreter functionality"""
    console.print(Panel.fit("Testing Open Interpreter", style="cyan"))
    
    try:
        # Configure interpreter
        interpreter.model = "local"
        interpreter.auto_run = True
        interpreter.system_message = """
        You are an AI assistant specialized in managing ASECN.
        Test the system by performing a simple task.
        """
        
        # Test memory operations
        console.print("[yellow]Testing memory operations...[/yellow]")
        memory_task = """
        1. List files in the memory-core directory
        2. Check if memory-state.json exists
        3. Return a summary
        """
        response = await interpreter.chat(memory_task)
        console.print(f"[green]Memory Test Response:[/green]\n{response}\n")
        
        # Test blockchain operations
        console.print("[yellow]Testing blockchain utilities...[/yellow]")
        blockchain_task = """
        1. Read blockchain.js utility functions
        2. List available ABI files
        3. Summarize capabilities
        """
        response = await interpreter.chat(blockchain_task)
        console.print(f"[green]Blockchain Test Response:[/green]\n{response}\n")
        
        return True
    except Exception as e:
        console.print(f"[red]Open Interpreter Test Failed:[/red] {str(e)}")
        return False

async def test_autogen():
    """Test AutoGen functionality"""
    console.print(Panel.fit("Testing AutoGen", style="cyan"))
    
    try:
        # Initialize AI Core which contains AutoGen configuration
        ai_core = EnhancedASECNAICore()
        
        # Test workflow selection
        console.print("[yellow]Testing workflow selection...[/yellow]")
        memory_task = "Recall recent system states and analyze patterns"
        workflow = await ai_core._quantum_workflow_selection(memory_task)
        console.print(f"[green]Selected Workflow for Memory Task:[/green] {workflow}\n")
        
        # Test quantum metrics
        console.print("[yellow]Testing quantum state metrics...[/yellow]")
        state = ai_core._initialize_quantum_state()
        metrics = ai_core._get_quantum_metrics(state)
        console.print(f"[green]Quantum Metrics:[/green]")
        for key, value in metrics.items():
            console.print(f"  {key}: {value}")
        
        # Test full task execution
        console.print("\n[yellow]Testing full task execution...[/yellow]")
        test_task = "Monitor current system performance and identify optimization opportunities"
        response = await ai_core.execute_task(test_task)
        console.print(f"[green]Full Task Response:[/green]")
        console.print(response)
        
        return True
    except Exception as e:
        console.print(f"[red]AutoGen Test Failed:[/red] {str(e)}")
        return False

async def main():
    """Run all tests"""
    console.print("\n=== Starting AI Systems Tests ===\n")
    
    # Test Open Interpreter
    interpreter_success = await test_interpreter()
    
    # Test AutoGen
    autogen_success = await test_autogen()
    
    # Report results
    console.print("\n=== Test Results ===")
    console.print(f"Open Interpreter: {'[green]PASS[/green]' if interpreter_success else '[red]FAIL[/red]'}")
    console.print(f"AutoGen: {'[green]PASS[/green]' if autogen_success else '[red]FAIL[/red]'}")

if __name__ == "__main__":
    # Add parent directory to Python path for imports
    sys.path.append(str(Path(__file__).parent.parent.parent))
    asyncio.run(main())