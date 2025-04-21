from typing import Dict, List
import autogen
from pathlib import Path
import os

# Base configuration for AutoGen agents
BASE_CONFIG = {
    "seed": 42,  # For reproducibility
    "temperature": 0.7,
    "max_tokens": 2000,
    "model": "local",  # Using local LLM
    "timeout": 600,
    "cache_seed": 42,
}

# Agent configurations
AGENT_CONFIGS = {
    "memory_agent": {
        "name": "MemoryAgent",
        "system_message": "You are a memory management specialist focusing on ASECN's memory core operations.",
        "modules": ["1_memory-core"]
    },
    "perception_agent": {
        "name": "PerceptionAgent",
        "system_message": "You are a data perception specialist handling ASECN's environmental inputs.",
        "modules": ["2_perception-layer"]
    },
    "action_agent": {
        "name": "ActionAgent",
        "system_message": "You are an action execution specialist managing ASECN's blockchain interactions.",
        "modules": ["3_action-layer"]
    },
    "evolver_agent": {
        "name": "EvolverAgent",
        "system_message": "You are an evolution specialist managing ASECN's self-improvement processes.",
        "modules": ["6_evolver"]
    }
}

# Create agent instances
def create_agents() -> Dict:
    agents = {}
    for agent_id, config in AGENT_CONFIGS.items():
        agents[agent_id] = autogen.AssistantAgent(
            name=config["name"],
            system_message=config["system_message"],
            llm_config=BASE_CONFIG
        )
    
    # Create UserProxyAgent for orchestration
    agents["orchestrator"] = autogen.UserProxyAgent(
        name="Orchestrator",
        system_message="You are the central orchestrator coordinating all ASECN agents.",
        code_execution_config={"work_dir": "workspace"},
        human_input_mode="NEVER"
    )
    
    return agents

# Workflow definitions
WORKFLOWS = {
    "memory_analysis": ["memory_agent", "orchestrator"],
    "environment_perception": ["perception_agent", "orchestrator"],
    "action_execution": ["action_agent", "orchestrator"],
    "system_evolution": ["evolver_agent", "orchestrator", "memory_agent"]
}

def initialize_workflow(workflow_name: str, agents: Dict) -> List:
    """Initialize a specific workflow with required agents"""
    if workflow_name not in WORKFLOWS:
        raise ValueError(f"Unknown workflow: {workflow_name}")
    
    return [agents[agent_name] for agent_name in WORKFLOWS[workflow_name]]

# Function to start group chat
def start_group_chat(agents: List, objective: str):
    groupchat = autogen.GroupChat(agents=agents, messages=[], max_round=10)
    manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=BASE_CONFIG)
    
    # Initiate the chat with the objective
    agents[0].initiate_chat(manager, message=objective)
    return groupchat