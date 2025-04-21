"""
Cleanup script to remove unnecessary test files and installations
"""
import os
import shutil
from pathlib import Path
import sys

# Files to preserve (core components)
PRESERVE = [
    'control/rag-enhanced.js',
    'control/managers_log.md',
    'control/project_checklist.md',
    'control/systems_report.md',
    'control/ai_integrations/__init__.py',
    'control/ai_integrations/interpreter_config.py',
    'control/ai_integrations/autogen_config.py',
]

# Define cleanup actions
def cleanup():
    root_dir = Path(__file__).parent.parent
    print(f"Cleaning up {root_dir}...")
    
    # Remove test batch files
    test_batch_files = list(root_dir.glob('test_*.bat'))
    for file in test_batch_files:
        print(f"Removing {file}")
        file.unlink(missing_ok=True)
    
    # Remove test dashboard
    test_dashboard = root_dir / 'control' / 'ai_integrations' / 'test_dashboard.py'
    if test_dashboard.exists():
        print(f"Removing {test_dashboard}")
        test_dashboard.unlink()
    
    # Remove test systems script
    test_systems = root_dir / 'control' / 'ai_integrations' / 'test_ai_systems.py'
    if test_systems.exists():
        print(f"Removing {test_systems}")
        test_systems.unlink()
    
    # Clean up ai_integrations folder - keep only essential files
    ai_integrations_dir = root_dir / 'control' / 'ai_integrations'
    if ai_integrations_dir.exists():
        for item in ai_integrations_dir.iterdir():
            if item.is_file() and not any(str(item.relative_to(root_dir)) == preserve for preserve in PRESERVE):
                if item.suffix in ['.py', '.md', '.js', '.bat'] and not item.name.startswith('__'):
                    print(f"Removing {item}")
                    item.unlink(missing_ok=True)
    
    # Remove logs directory if it exists
    logs_dir = root_dir / 'control' / 'ai_integrations' / 'logs'
    if logs_dir.exists() and logs_dir.is_dir():
        print(f"Removing {logs_dir}")
        shutil.rmtree(logs_dir, ignore_errors=True)
    
    # Remove __pycache__ directories
    pycache_dirs = list(root_dir.glob('**/__pycache__'))
    for pycache in pycache_dirs:
        print(f"Removing {pycache}")
        shutil.rmtree(pycache, ignore_errors=True)
    
    # Clean up cli directory
    cli_dir = root_dir / 'cli'
    if cli_dir.exists():
        for item in cli_dir.iterdir():
            if item.is_file() and item.suffix not in ['.md', '.txt']:
                if item.name not in ['requirements.txt']:
                    print(f"Removing {item}")
                    item.unlink(missing_ok=True)
    
    print("Cleanup complete!")

if __name__ == "__main__":
    cleanup()