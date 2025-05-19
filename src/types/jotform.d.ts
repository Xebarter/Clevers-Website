export {};

declare global {
  interface Window {
    FrameBuilder: any; // Use `any` for simplicity, or define a specific interface if needed
    handleIFrameMessage: (e: MessageEvent) => void;
    isPermitted: (originUrl: string, whitelisted_domains: string[]) => boolean;
    initInlineEmbed?: (options: {
      iframeDomId: string;
      formId: string;
      formFrame: HTMLIFrameElement;
      embedUrl: URL;
      baseUrl: string;
      isEnterprise: boolean;
      defaultStyles: any;
    }) => { destroy: () => void; togglePanel: (coords: { x: number; y: number }) => void };
    initPlatformEmbedHandler?: (
      platform: string,
      options: { formId: string; formType: string; isGuestOwner: boolean }
    ) => void;
    jfDeviceType?: string;
  }

  // For jQuery-like $jot used in the script
  const $jot: any;
}