#!/usr/bin/env python3
"""Tiny static file server (no dependencies). Run: python3 serve.py
Serves this folder on http://localhost:4178 with caching disabled, so token
edits always show up on a refresh.
"""
import functools
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "4178"))


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


httpd = ThreadingHTTPServer(("127.0.0.1", PORT), functools.partial(Handler, directory=ROOT))
print("Serving at http://localhost:%d  (Ctrl+C to stop)" % PORT)
print("  Style sheet: http://localhost:%d/styleguide/" % PORT)
httpd.serve_forever()
