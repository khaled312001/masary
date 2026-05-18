import os, paramiko, sys
PWD = os.environ["MASAARY_SSH_PASSWORD"]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("46.202.174.126", port=65002, username="u352429374", password=PWD,
          look_for_keys=False, allow_agent=False, timeout=30)
s = c.open_sftp()
print("sftp cwd:", s.getcwd())
print("listing:")
for f in s.listdir("."):
    print(" ", f)
s.close(); c.close()
