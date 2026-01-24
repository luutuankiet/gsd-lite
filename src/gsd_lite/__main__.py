import shutil
import sys
from pathlib import Path
import typer
from rich.console import Console
from rich.panel import Panel

app = typer.Typer()
console = Console()

from importlib.metadata import version as get_package_version, PackageNotFoundError

def get_version():
    try:
        return get_package_version("gsd-lite")
    except PackageNotFoundError:
        return "dev"

@app.command()
def main(
    force: bool = typer.Option(False, "--force", "-f", help="Force overwrite existing files"),
    update: bool = typer.Option(False, "--update", "-u", help="Update templates in an existing project"),
    version: bool = typer.Option(False, "--version", "-v", help="Show version")
):
    """
    GSD-Lite Manager
    """
    if version:
        console.print(f"gsd-lite version: {get_version()}")
        raise typer.Exit()

    # 1. Setup paths
    package_dir = Path(__file__).parent
    source_dir = package_dir / "template"
    
    cwd = Path.cwd()
    root_dir = cwd / "gsd-lite"
    template_dest = root_dir / "template"

    console.print(Panel.fit("[bold cyan]GSD-Lite Manager[/bold cyan]", border_style="cyan"))

    # 2. Validation of source
    if not source_dir.exists():
        console.print(f"[bold red]Error:[/bold red] Template directory not found at {source_dir}")
        raise typer.Exit(code=1)

    # 3. Update Mode
    if update:
        if not root_dir.exists():
            console.print(f"[bold red]Error:[/bold red] No gsd-lite project found at {root_dir}")
            console.print("Run without --update to initialize a new project.")
            raise typer.Exit(code=1)
        
        console.print(f"[yellow]Updating templates to version {get_version()}...[/yellow]")
        # Force enable overwrite for update
        force = True

    # 4. Install/Check
    if template_dest.exists() and not force:
        console.print(f"[yellow]Warning:[/yellow] Directory [bold]{template_dest}[/bold] already exists.")
        console.print("Use [bold]--update[/bold] to refresh templates.")
        console.print("Use [bold]--force[/bold] to overwrite everything.")
        raise typer.Exit(code=1)

    # 5. Execution
    try:
        root_dir.mkdir(exist_ok=True)

        if template_dest.exists():
            shutil.rmtree(template_dest)

        shutil.copytree(source_dir, template_dest)

        # Write version receipt
        (template_dest / "VERSION").write_text(get_version())

        # 6. Scaffold core files to gsd-lite root (only if they don't exist)
        core_files = ["WORK.md", "STATE.md", "INBOX.md", "HISTORY.md"]
        scaffolded = []
        skipped = []

        for filename in core_files:
            dest_file = root_dir / filename
            source_file = template_dest / filename

            if dest_file.exists():
                skipped.append(filename)
            else:
                if source_file.exists():
                    shutil.copy2(source_file, dest_file)
                    scaffolded.append(filename)

        if update:
             console.print(f"[green]✔ Successfully updated templates (v{get_version()}) in:[/green] {template_dest}")
        else:
             console.print(f"[green]✔ Successfully initialized GSD-Lite templates in:[/green] {template_dest}")

        # Report on scaffolded files
        if scaffolded:
            console.print(f"[green]✔ Scaffolded core files:[/green] {', '.join(scaffolded)}")

        if skipped:
            console.print(f"[blue]ℹ Skipped existing files:[/blue] {', '.join(skipped)}")

        if not update:
             console.print("\n[bold]Next Steps:[/bold]")
             console.print("1. Tell your agent to load file [bold]gsd-lite/template/PROTOCOL.md[/bold]")
             console.print("2. Describe your task - your session is now powered by gsd!")

    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {e}")
        raise typer.Exit(code=1)

if __name__ == "__main__":
    app()