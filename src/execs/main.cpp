#include <windows.h>
#include <atlstr.h>


int main() {
  int argc;
  LPWSTR *argv;
  LPWSTR cmd;
  LPWSTR path;
  int ret = 1;

  argv = CommandLineToArgvW(GetCommandLineW(), &argc);

  if (NULL == argv) {
    wprintf(L"CommandLineToArgvW failed\n");
    return 1;
  }

  if (argc <= 2) {
    wprintf(L"Usage: cli-fontloader add/remove path\n");
    return 1;
  }

  cmd = argv[1];
  path = argv[2];

  if (lstrcmpW(L"add", cmd) == 0) {
    // add font
    ret = AddFontResourceW(path);
  } else if (lstrcmpW(L"remove", cmd) == 0) {
    // remove font
    ret = RemoveFontResourceW(path);
  }


  // output json
  printf("{\"status\":%d,\"type\":\"%ws\",\"path\":\"%ws\"}\n", ret, cmd, path);

  LocalFree(argv);
  return 0;
}
