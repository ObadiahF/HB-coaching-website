
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const USER: string;
	export const npm_config_version_commit_hooks: string;
	export const npm_config_user_agent: string;
	export const GIO_MODULE_DIR: string;
	export const npm_config_bin_links: string;
	export const XDG_SESSION_TYPE: string;
	export const GTK_EXE_PREFIX_VSCODE_SNAP_ORIG: string;
	export const GIT_ASKPASS: string;
	export const npm_node_execpath: string;
	export const npm_package_devDependencies_vite: string;
	export const npm_config_init_version: string;
	export const GDK_BACKEND_VSCODE_SNAP_ORIG: string;
	export const SHLVL: string;
	export const LESS: string;
	export const HOME: string;
	export const LOCPATH_VSCODE_SNAP_ORIG: string;
	export const OLDPWD: string;
	export const CHROME_DESKTOP: string;
	export const DESKTOP_SESSION: string;
	export const GTK_PATH: string;
	export const NVM_BIN: string;
	export const TERM_PROGRAM_VERSION: string;
	export const LSCOLORS: string;
	export const NVM_INC: string;
	export const ZSH: string;
	export const GTK_IM_MODULE_FILE: string;
	export const npm_config_init_license: string;
	export const GNOME_SHELL_SESSION_MODE: string;
	export const GTK_MODULES: string;
	export const GSETTINGS_SCHEMA_DIR_VSCODE_SNAP_ORIG: string;
	export const PAGER: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const YARN_WRAP_OUTPUT: string;
	export const npm_config_version_tag_prefix: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const SYSTEMD_EXEC_PID: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_package_dependencies_dotenv: string;
	export const npm_config_engine_strict: string;
	export const npm_config_resolution_mode: string;
	export const COLORTERM: string;
	export const npm_package_description: string;
	export const NVM_DIR: string;
	export const npm_package_readmeFilename: string;
	export const npm_package_scripts_dev: string;
	export const GTK_IM_MODULE: string;
	export const LOGNAME: string;
	export const npm_package_type: string;
	export const _: string;
	export const npm_package_private: string;
	export const XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG: string;
	export const XDG_SESSION_CLASS: string;
	export const XDG_DATA_DIRS_VSCODE_SNAP_ORIG: string;
	export const USER_ZDOTDIR: string;
	export const npm_config_registry: string;
	export const USERNAME: string;
	export const TERM: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
	export const npm_config_ignore_scripts: string;
	export const WINDOWPATH: string;
	export const PATH: string;
	export const NODE: string;
	export const SESSION_MANAGER: string;
	export const GTK_EXE_PREFIX: string;
	export const npm_package_name: string;
	export const XDG_MENU_PREFIX: string;
	export const GNOME_TERMINAL_SCREEN: string;
	export const XDG_RUNTIME_DIR: string;
	export const GDK_BACKEND: string;
	export const DISPLAY: string;
	export const LOCPATH: string;
	export const LANG: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const VSCODE_INJECTION: string;
	export const GIO_MODULE_DIR_VSCODE_SNAP_ORIG: string;
	export const XMODIFIERS: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XAUTHORITY: string;
	export const LS_COLORS: string;
	export const GNOME_TERMINAL_SERVICE: string;
	export const TERM_PROGRAM: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const npm_lifecycle_script: string;
	export const SSH_AGENT_LAUNCHER: string;
	export const SSH_AUTH_SOCK: string;
	export const GSETTINGS_SCHEMA_DIR: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_version_git_message: string;
	export const SHELL: string;
	export const npm_lifecycle_event: string;
	export const npm_package_version: string;
	export const QT_ACCESSIBILITY: string;
	export const GDMSESSION: string;
	export const npm_config_argv: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_scripts_build: string;
	export const GTK_PATH_VSCODE_SNAP_ORIG: string;
	export const npm_package_dependencies_gh_pages: string;
	export const GTK_IM_MODULE_FILE_VSCODE_SNAP_ORIG: string;
	export const npm_config_version_git_tag: string;
	export const npm_config_version_git_sign: string;
	export const GPG_AGENT_INFO: string;
	export const npm_config_strict_ssl: string;
	export const QT_IM_MODULE: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const npm_package_dependencies_firebase: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const XDG_CONFIG_DIRS: string;
	export const NVM_CD_FLAGS: string;
	export const XDG_DATA_DIRS: string;
	export const ZDOTDIR: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_config_save_prefix: string;
	export const npm_config_ignore_optional: string;
	export const npm_package_scripts_preview: string;
	export const VTE_VERSION: string;
	export const INIT_CWD: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		USER: string;
		npm_config_version_commit_hooks: string;
		npm_config_user_agent: string;
		GIO_MODULE_DIR: string;
		npm_config_bin_links: string;
		XDG_SESSION_TYPE: string;
		GTK_EXE_PREFIX_VSCODE_SNAP_ORIG: string;
		GIT_ASKPASS: string;
		npm_node_execpath: string;
		npm_package_devDependencies_vite: string;
		npm_config_init_version: string;
		GDK_BACKEND_VSCODE_SNAP_ORIG: string;
		SHLVL: string;
		LESS: string;
		HOME: string;
		LOCPATH_VSCODE_SNAP_ORIG: string;
		OLDPWD: string;
		CHROME_DESKTOP: string;
		DESKTOP_SESSION: string;
		GTK_PATH: string;
		NVM_BIN: string;
		TERM_PROGRAM_VERSION: string;
		LSCOLORS: string;
		NVM_INC: string;
		ZSH: string;
		GTK_IM_MODULE_FILE: string;
		npm_config_init_license: string;
		GNOME_SHELL_SESSION_MODE: string;
		GTK_MODULES: string;
		GSETTINGS_SCHEMA_DIR_VSCODE_SNAP_ORIG: string;
		PAGER: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		YARN_WRAP_OUTPUT: string;
		npm_config_version_tag_prefix: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		SYSTEMD_EXEC_PID: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_package_dependencies_dotenv: string;
		npm_config_engine_strict: string;
		npm_config_resolution_mode: string;
		COLORTERM: string;
		npm_package_description: string;
		NVM_DIR: string;
		npm_package_readmeFilename: string;
		npm_package_scripts_dev: string;
		GTK_IM_MODULE: string;
		LOGNAME: string;
		npm_package_type: string;
		_: string;
		npm_package_private: string;
		XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG: string;
		XDG_SESSION_CLASS: string;
		XDG_DATA_DIRS_VSCODE_SNAP_ORIG: string;
		USER_ZDOTDIR: string;
		npm_config_registry: string;
		USERNAME: string;
		TERM: string;
		GNOME_DESKTOP_SESSION_ID: string;
		npm_config_ignore_scripts: string;
		WINDOWPATH: string;
		PATH: string;
		NODE: string;
		SESSION_MANAGER: string;
		GTK_EXE_PREFIX: string;
		npm_package_name: string;
		XDG_MENU_PREFIX: string;
		GNOME_TERMINAL_SCREEN: string;
		XDG_RUNTIME_DIR: string;
		GDK_BACKEND: string;
		DISPLAY: string;
		LOCPATH: string;
		LANG: string;
		XDG_CURRENT_DESKTOP: string;
		VSCODE_INJECTION: string;
		GIO_MODULE_DIR_VSCODE_SNAP_ORIG: string;
		XMODIFIERS: string;
		XDG_SESSION_DESKTOP: string;
		XAUTHORITY: string;
		LS_COLORS: string;
		GNOME_TERMINAL_SERVICE: string;
		TERM_PROGRAM: string;
		VSCODE_GIT_IPC_HANDLE: string;
		npm_lifecycle_script: string;
		SSH_AGENT_LAUNCHER: string;
		SSH_AUTH_SOCK: string;
		GSETTINGS_SCHEMA_DIR: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_version_git_message: string;
		SHELL: string;
		npm_lifecycle_event: string;
		npm_package_version: string;
		QT_ACCESSIBILITY: string;
		GDMSESSION: string;
		npm_config_argv: string;
		npm_package_devDependencies_svelte: string;
		npm_package_scripts_build: string;
		GTK_PATH_VSCODE_SNAP_ORIG: string;
		npm_package_dependencies_gh_pages: string;
		GTK_IM_MODULE_FILE_VSCODE_SNAP_ORIG: string;
		npm_config_version_git_tag: string;
		npm_config_version_git_sign: string;
		GPG_AGENT_INFO: string;
		npm_config_strict_ssl: string;
		QT_IM_MODULE: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		npm_package_dependencies_firebase: string;
		PWD: string;
		npm_execpath: string;
		XDG_CONFIG_DIRS: string;
		NVM_CD_FLAGS: string;
		XDG_DATA_DIRS: string;
		ZDOTDIR: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_config_save_prefix: string;
		npm_config_ignore_optional: string;
		npm_package_scripts_preview: string;
		VTE_VERSION: string;
		INIT_CWD: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
