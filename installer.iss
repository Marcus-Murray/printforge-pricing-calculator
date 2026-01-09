; PrintForge Pricing Calculator - Inno Setup Installer Script
; This creates a professional Windows installer

#define MyAppName "PrintForge Pricing Calculator"
#define MyAppVersion "1.1.0"
#define MyAppPublisher "PrintForge"
#define MyAppURL "https://github.com/printforge"
#define MyAppExeName "PrintForge.exe"

[Setup]
; App identity
AppId={{8F9E7D6C-5B4A-3C2D-1E0F-9A8B7C6D5E4F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}

; Installation paths
DefaultDirName={autopf}\PrintForge
DefaultGroupName=PrintForge
AllowNoIcons=yes

; Output
OutputDir=installer_output
OutputBaseFilename=PrintForge_Setup_{#MyAppVersion}
SetupIconFile=static\images\icon.ico
Compression=lzma2/ultra64
SolidCompression=yes

; Visual appearance
WizardStyle=modern
DisableProgramGroupPage=yes
PrivilegesRequired=admin

; License and info
LicenseFile=LICENSE.txt
InfoBeforeFile=INSTALLER_INFO.txt

; Uninstall
UninstallDisplayIcon={app}\{#MyAppExeName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Main executable and dependencies (from PyInstaller output)
Source: "dist\PrintForge\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

; Documentation
Source: "README.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "DESKTOP_README.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "CHANGELOG.md"; DestDir: "{app}"; Flags: ignoreversion; AfterInstall: CreateDataFolder

[Icons]
; Start Menu shortcut
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"

; Desktop shortcut (optional)
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

; Quick Launch shortcut (optional)
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

[Run]
; Option to launch after installation
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
procedure CreateDataFolder;
var
  DataPath: String;
begin
  // Create user data folder
  DataPath := ExpandConstant('{userappdata}\PrintForge');
  if not DirExists(DataPath) then
    CreateDir(DataPath);
end;

function InitializeSetup(): Boolean;
begin
  Result := True;

  // Check if previous version is installed
  if RegKeyExists(HKEY_LOCAL_MACHINE, 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{8F9E7D6C-5B4A-3C2D-1E0F-9A8B7C6D5E4F}_is1') then
  begin
    if MsgBox('A previous version of PrintForge is installed. Do you want to uninstall it first?', mbConfirmation, MB_YESNO) = IDYES then
    begin
      // User will need to uninstall manually
      MsgBox('Please uninstall the previous version from Windows Settings before continuing.', mbInformation, MB_OK);
      Result := False;
    end;
  end;
end;

[UninstallDelete]
; Clean up user data on uninstall (with confirmation)
Type: filesandordirs; Name: "{userappdata}\PrintForge"
