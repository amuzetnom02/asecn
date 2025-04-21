@echo off
echo Installing/Updating required packages...
call .\control\ai_env\Scripts\activate.bat
python -m pip install --upgrade pip
pip install textual typer rich prompt_toolkit numpy openai pyautogen

echo Starting ASECN Terminal Interface...
python cli\start_asecn.py
pause