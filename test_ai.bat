@echo off
echo Running ASECN AI System Tests...
call control\ai_env\Scripts\activate.bat
python control\ai_integrations\test_ai_systems.py
pause