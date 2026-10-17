"""Run the BGS website locally: python3 serve-local.py [port]."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import sys
ROOT = Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def do_GET(self):
        route = self.path.split('?', 1)[0]
        target = ROOT / route.lstrip('/')
        if not target.exists() and target.with_suffix('.html').is_file():
            self.path = route + '.html'
        super().do_GET()
port = int(sys.argv[1]) if len(sys.argv)>1 else 8875
print(f'BGS website: http://127.0.0.1:{port}/', flush=True)
ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
