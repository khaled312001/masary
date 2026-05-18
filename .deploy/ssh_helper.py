"""Reusable SSH helper for the Hostinger deployment session.

Usage:
    python ssh_helper.py "command to run"
    python ssh_helper.py @path/to/script.sh           # run a local script remotely

Reads credentials from env vars to avoid leaving them on disk:
    MASAARY_SSH_HOST, MASAARY_SSH_PORT,
    MASAARY_SSH_USER, MASAARY_SSH_PASSWORD
"""

import os
import sys
import time
import paramiko

HOST = os.environ.get("MASAARY_SSH_HOST", "46.202.174.126")
PORT = int(os.environ.get("MASAARY_SSH_PORT", "65002"))
USER = os.environ.get("MASAARY_SSH_USER", "u352429374")
PASSWORD = os.environ.get("MASAARY_SSH_PASSWORD")

if not PASSWORD:
    print("ERROR: MASAARY_SSH_PASSWORD env var is required", file=sys.stderr)
    sys.exit(2)


def run(command: str, timeout: int = 120) -> int:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(
            hostname=HOST,
            port=PORT,
            username=USER,
            password=PASSWORD,
            look_for_keys=False,
            allow_agent=False,
            timeout=30,
        )
    except Exception as e:  # noqa: BLE001
        print(f"SSH connect failed: {e}", file=sys.stderr)
        return 3

    try:
        stdin, stdout, stderr = client.exec_command(command, timeout=timeout, get_pty=False)
        for line in iter(stdout.readline, ""):
            sys.stdout.write(line)
            sys.stdout.flush()
        err = stderr.read().decode("utf-8", "replace")
        if err.strip():
            sys.stderr.write(err)
        exit_code = stdout.channel.recv_exit_status()
        return exit_code
    finally:
        client.close()


def upload(local_path: str, remote_path: str) -> int:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        hostname=HOST,
        port=PORT,
        username=USER,
        password=PASSWORD,
        look_for_keys=False,
        allow_agent=False,
        timeout=30,
    )
    try:
        sftp = client.open_sftp()
        sftp.put(local_path, remote_path)
        sftp.close()
        print(f"uploaded {local_path} -> {remote_path}")
        return 0
    finally:
        client.close()


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    arg = sys.argv[1]
    if arg == "--upload" and len(sys.argv) >= 4:
        return upload(sys.argv[2], sys.argv[3])
    if arg.startswith("@"):
        with open(arg[1:], "r", encoding="utf-8") as fh:
            command = fh.read()
        return run(command, timeout=int(os.environ.get("MASAARY_SSH_TIMEOUT", "600")))
    return run(arg, timeout=int(os.environ.get("MASAARY_SSH_TIMEOUT", "600")))


if __name__ == "__main__":
    sys.exit(main())
