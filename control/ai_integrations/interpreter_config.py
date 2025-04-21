import interpreter
from pathlib import Path
import os
import sys

# Add the project root to the Python path
sys.path.append(str(Path(__file__).parent.parent.parent))

class ASECNInterpreter:
    def __init__(self):
        # Configure Open Interpreter
        interpreter.model = "local"  # Use local LLM
        interpreter.auto_run = True  # Enable autonomous execution
        interpreter.conversation_history = True
        interpreter.context_window = 4096  # Match your model's context window
        
        # Set up system message for ASECN-specific tasks
        interpreter.system_message = """
        You are an AI assistant specialized in managing ASECN (Autonomous Self-Evolving Crypto Node).
        You have access to the following capabilities:
        1. Memory Core operations
        2. Blockchain interactions
        3. Smart contract deployment
        4. System evolution management
        
        Always validate inputs and handle errors appropriately.
        Maintain atomic operations and ensure data consistency.
        """
        
        # Set safe execution directories
        self.safe_paths = [
            Path("c:/_worxpace/asecn/1_memory-core"),
            Path("c:/_worxpace/asecn/2_perception-layer"),
            Path("c:/_worxpace/asecn/3_action-layer"),
            Path("c:/_worxpace/asecn/6_evolver")
        ]
        
        # Initialize conversation history
        self.reset_conversation()

    def reset_conversation(self):
        """Reset the conversation history"""
        interpreter.reset()
        self.load_context()
    
    def load_context(self):
        """Load ASECN-specific context"""
        # Load essential context about the system state
        interpreter.context.append({
            "role": "system",
            "content": "Loading ASECN system state and configuration..."
        })
        
        # You can add more context here as needed
    
    def validate_path(self, path: str) -> bool:
        """Ensure operations only occur in safe directories"""
        path = Path(path).resolve()
        return any(safe_path in path.parents for safe_path in self.safe_paths)
    
    async def execute(self, command: str, context: dict = None):
        """Execute a command with safety checks"""
        if context:
            interpreter.context.append({
                "role": "system",
                "content": str(context)
            })
        
        try:
            # Execute command with safety checks
            if any(unsafe_cmd in command.lower() for unsafe_cmd in ['rm -rf', 'deltree', 'format']):
                raise ValueError("Potentially dangerous command detected")
            
            response = await interpreter.chat(command)
            return response
        except Exception as e:
            return {
                "error": True,
                "message": str(e),
                "command": command
            }
    
    def get_conversation_history(self):
        """Get the full conversation history"""
        return interpreter.messages
    
    def save_conversation(self, filepath: str):
        """Save conversation history to file"""
        if not self.validate_path(filepath):
            raise ValueError("Invalid save location")
        
        with open(filepath, 'w') as f:
            f.write(str(interpreter.messages))