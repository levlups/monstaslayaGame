from __future__ import annotations

import functools
import http.server
import socket
import socketserver
import sys
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TITLE = "Monsta Slaya"


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        pass


def find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def start_server() -> tuple[socketserver.TCPServer, str]:
    port = find_free_port()
    handler = functools.partial(QuietHandler)
    server = socketserver.ThreadingTCPServer(("127.0.0.1", port), handler)
    server.daemon_threads = True
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, f"http://127.0.0.1:{port}/index.html"


def show_missing_webview_message() -> None:
    message = (
        "Monsta Slaya needs the pywebview package to run inside a Python window.\n\n"
        "Open InstallPythonWindowSupport.bat once, then run RunGameWindow.bat again."
    )
    try:
        import tkinter as tk
        from tkinter import messagebox

        root = tk.Tk()
        root.withdraw()
        messagebox.showinfo("Python window support needed", message)
        root.destroy()
    except Exception:
        print(message)


def main() -> int:
    try:
        import webview
    except ImportError:
        show_missing_webview_message()
        return 1

    server, url = start_server()
    try:
        window = webview.create_window(
            TITLE,
            url,
            width=900,
            height=920,
            min_size=(820, 840),
            background_color="#05050a",
        )
        webview.start(debug=False)
    finally:
        server.shutdown()
        server.server_close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
