import shutil
import sys
from pathlib import Path
import typer
from rich.console import Console
from rich.panel import Panel
from importlib.metadata import version as get_package_version, PackageNotFoundError

app = typer.Typer()
console = Console()

def get_version():
    try:
        return get_package_version("gsd-lite")
    except PackageNotFoundError:
        return "dev"

@app.callback(invoke_without_command=True)
def callback(ctx: typer.Context, version: bool = typer.Option(False, "--version", "-v", help="Show version")):
    """
    GSD-Lite Manager
    """
    if version:
        console.print(f"gsd-lite version: {get_version()}")
        raise typer.Exit()
    
    if ctx.invoked_subcommand is None:
        console.print(Panel.fit("[bold cyan]GSD-Lite Manager[/bold cyan]", border_style="cyan"))
        console.print("Run [bold]gsd-lite install[/bold] to set up globally.")
        console.print("Run [bold]gsd-lite install --local[/bold] to set up for this project.")
        console.print("Run [bold]gsd-lite --help[/bold] for options.")

@app.command()
def install(
    local: bool = typer.Option(False, "--local", "-l", help="Install locally in current directory"),
    force: bool = typer.Option(False, "--force", "-f", help="Force overwrite of ALL files (including user artifacts)"),
    update: bool = typer.Option(False, "--update", "-u", help="Update templates (preserves user artifacts)")
):
    """
    Install GSD-Lite artifacts.
    Global (default): ~/.config/opencode/
    Local (--local):  ./.opencode/ + ./gsd-lite/
    """
    # Force is stronger than update
    if force:
        update = True

    # 1. Determine Roots
    if local:
        base_root = Path.cwd()
        config_root = base_root / ".opencode"
        console.print(f"[bold cyan]Installing GSD-Lite Locally[/bold cyan] to {base_root}")
    else:
        base_root = Path.home() / ".config" / "opencode"
        config_root = base_root
        console.print(f"[bold cyan]Installing GSD-Lite Globally[/bold cyan] to {base_root}")

    # 2. Define Targets
    agents_dir = config_root / "agents"
    command_dir = config_root / "command" / "gsd-lite"
    artifacts_dir = base_root / "gsd-lite"
    
    # 3. Source
    template_src = Path(__file__).parent / "template"
    if not template_src.exists():
        console.print(f"[bold red]Error:[/bold red] Template directory not found at {template_src}")
        raise typer.Exit(code=1)

    # 4. Create Directories
    try:
        agents_dir.mkdir(parents=True, exist_ok=True)
        command_dir.mkdir(parents=True, exist_ok=True)
        artifacts_dir.mkdir(parents=True, exist_ok=True)

        # 5. Install Agents
        agents_src_dir = template_src / "agents"
        if agents_src_dir.exists():
            count = 0
            for item in agents_src_dir.iterdir():
                if item.suffix == ".md":
                    shutil.copy2(item, agents_dir / item.name)
                    count += 1
            console.print(f"[green]✔ Installed Agents:[/green] {agents_dir} ({count} files)")
        else:
            console.print(f"[yellow]⚠ Warning:[/yellow] No agents directory found at {agents_src_dir}")

        # 6. Install Workflows (Always overwrite)
        workflow_src = template_src / "workflows"
        count = 0
        if workflow_src.exists():
            for item in workflow_src.iterdir():
                if item.suffix == ".md":
                    shutil.copy2(item, command_dir / item.name)
                    count += 1
            console.print(f"[green]✔ Installed Workflows:[/green] {command_dir} ({count} files)")
        else:
            console.print(f"[yellow]⚠ Warning:[/yellow] No workflows directory found at {workflow_src}")

        # 7. Install/Update Artifacts (gsd-lite/)
        
        # 7a. Templates subdir (Reference) - ALWAYS OVERWRITE
        artifacts_template_dest = artifacts_dir / "template"
        if artifacts_template_dest.exists():
            shutil.rmtree(artifacts_template_dest)
        shutil.copytree(template_src, artifacts_template_dest)
        
        # Write version
        (artifacts_template_dest / "VERSION").write_text(get_version())
        console.print(f"[green]✔ Updated Templates:[/green] {artifacts_template_dest}")

        # 7b. Core Files (User Data) - SKIP IF EXISTS
        core_files = ["WORK.md", "INBOX.md", "HISTORY.md", "PROJECT.md", "ARCHITECTURE.md"]
        scaffolded = []
        skipped = []
        
        for filename in core_files:
            dest_file = artifacts_dir / filename
            source_file = template_src / filename
            
            if not source_file.exists():
                continue

            if dest_file.exists() and not force:
                skipped.append(filename)
            else:
                shutil.copy2(source_file, dest_file)
                scaffolded.append(filename)

        if scaffolded:
            console.print(f"[green]✔ Scaffolded Artifacts:[/green] {', '.join(scaffolded)}")
        if skipped:
            console.print(f"[blue]ℹ Preserved User Artifacts:[/blue] {', '.join(skipped)}")

        console.print("\n[bold]Installation Complete![/bold]")
        if local:
            console.print("Run [bold]@gsd-lite[/bold] to start.")
        else:
            console.print("Run [bold]@gsd-lite[/bold] in any project to start.")

    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {e}")
        raise typer.Exit(code=1)

if __name__ == "__main__":
    app()