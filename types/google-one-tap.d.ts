declare module "google-one-tap" {
	export interface CredentialResponse {
		clientId: string;
		credential: string;
		select_by: string;
	}

	export interface IdConfiguration {
		client_id: string;
		auto_select?: boolean;
		callback: (response: CredentialResponse) => void;
		login_uri?: string;
		native_callback?: (...args: any[]) => void;
		prompt_parent_id?: string;
		nonce?: string;
		context?: string;
		state_cookie_domain?: string;
		ux_mode?: "popup" | "redirect";
		allowed_parent_origin?: string | string[];
		intermediate_iframe_close_callback?: (...args: any[]) => void;
		itp_support?: boolean;
		use_fedcm_for_prompt?: boolean;
	}

	export interface accounts {
		id: {
			initialize: (input: IdConfiguration) => void;
			prompt: (momentListener?: () => void) => void;
			cancel: () => void;
			renderButton: (
				parent: HTMLElement,
				options: Record<string, any>
			) => void;
		};
	}
}
