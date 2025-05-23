"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export default function ContactForm() {
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the script is already loaded to prevent duplicates
    if (formContainerRef.current && !window.FrameBuilder) {
      const script = document.createElement("script");
      script.innerHTML = `
        var qsProxy = {};
        function FrameBuilder(formId, appendTo, initialHeight, title, inlineEmbedParams, platformEmbedParams) {
          this.formId = formId;
          this.initialHeight = initialHeight;
          this.frame = null;
          this.timeInterval = 200;
          this.appendTo = appendTo || false;
          this.formSubmitted = 0;
          this.frameMinWidth = '100%';
          this.defaultHeight = '';
          this.formFrame = null;
          this.formFrameLoaded = false;
          this.embedUrl = null;
          this.targetOrigin = '*';
          this.inlineEmbedInstance = null;
          this.inlineEmbedScriptLoaded = false;
          this.inlineEmbedParams = inlineEmbedParams || {};
          this.platformEmbedParams = platformEmbedParams || {};
          this.loadCDNScript = (umdUrl, onLoad) => {
            const script = document.createElement('script');
            script.src = umdUrl;
            script.onload = onLoad;
            document.head.appendChild(script);
          };
          this.getEmbeddedPlatform = () => {
            if (window.location && window.location.host === 'canva-embed.com') {
              return 'canva';
            }
            return null;
          };
          this.tryInlineEmbed = () => {
            const allowedProtocols = ['https:'];
            let hasValidURL = false;
            try {
              this.embedUrl = new URL(window.location.href);
              hasValidURL = allowedProtocols.includes(this.embedUrl.protocol);
            } catch (e) {}
            if (!hasValidURL) {
              console.error('Invalid Embed URL');
              return;
            }
            try {
              const url = new URL("https://form.jotform.com/251384614160048");
              this.targetOrigin = url.origin;
            } catch (e) {}
            if (this.targetOrigin === this.embedUrl.origin) {
              return;
            }
            const timeoutAfter = 15 * 1000;
            const startTime = new Date().getTime();
            const interval = setInterval(() => {
              if (new Date().getTime() - startTime > timeoutAfter) {
                clearInterval(interval);
              }
              if (this.formFrameLoaded) {
                clearInterval(interval);
                this.bindIframeMessageListener();
                this.loadEmbedStyles();
                this.sendPostMessage({ type: 'hasStorageAccess' });
              }
            }, 250);
          };
          this.bindIframeMessageListener = () => {
            window.addEventListener('message', event => {
              if (!this.formFrame || !this.formFrame.contentWindow || event.source !== this.formFrame.contentWindow) {
                return;
              }
              const message = this.safeJsonParse(event.data, {});
              if (['storageAccessGranted', 'storageAccessDenied', 'toggleInlineEmbedPanel'].includes(message.type)) {
                this[message.type]();
              }
              if (typeof event.data === 'object' && event.data.action === 'submission-completed' && event.data.formID === this.formId) {
                this.inlineEmbedInstance.destroy();
                this.inlineEmbedInstance = null;
              }
            }, false);
          };
          this.loadEmbedStyles = () => {
            this.sendPostMessage({
              type: 'loadEmbedStyle',
              formId: this.formId,
              embedUrl: this.embedUrl,
              embedKeys: this.inlineEmbedParams.embedKeys,
            }, this.formFrame);
          };
          this.storageAccessGranted = () => {
            if (!this.inlineEmbedParams.umdUrl) {
              return;
            }
            if (this.inlineEmbedScriptLoaded) {
              console.warn('Inline embed UMD script already loaded');
              return;
            }
            const onLoad = () => {
              this.inlineEmbedScriptLoaded = true;
              console.log('Inline embed UMD script loaded');
              this.initializeInlineEmbed();
            };
            this.loadCDNScript(this.inlineEmbedParams.umdUrl, onLoad);
          };
          this.storageAccessDenied = () => {
            console.warn('Storage access denied');
          };
          this.initializeInlineEmbed = () => {
            if (!window.initInlineEmbed) {
              console.error('initInlineEmbed not found on window');
              return;
            }
            if (this.inlineEmbedInstance) {
              console.warn('Inline embed already initialized');
              return;
            }
            this.inlineEmbedInstance = window.initInlineEmbed({
              iframeDomId: this.iframeDomId,
              formId: this.formId,
              formFrame: this.formFrame,
              embedUrl: this.embedUrl,
              baseUrl: this.inlineEmbedParams.baseURL,
              isEnterprise: this.inlineEmbedParams.isEnterprise,
              defaultStyles: this.inlineEmbedParams.styleJSON,
            });
          };
          this.toggleInlineEmbedPanel = () => {
            if (this.inlineEmbedInstance) {
              this.inlineEmbedInstance.togglePanel({
                x: this.formFrame.offsetLeft,
                y: this.formFrame.offsetTop,
              });
            }
          };
          this.safeJsonParse = (jsonString, defaultValue = null) => {
            try {
              return JSON.parse(jsonString);
            } catch (error) {
              return defaultValue;
            }
          };
          this.sendPostMessage = message => {
            if (this.formFrame && this.formFrame.contentWindow) {
              this.formFrame.contentWindow.postMessage(JSON.stringify(message), this.targetOrigin);
            }
          };
          this.createFrame = function() {
            this.iframeDomId = document.getElementById(this.formId) ? this.formId + '_' + new Date().getTime() : this.formId;
            if (typeof $jot !== 'undefined') {
              var iframe = document.getElementById("251384614160048");
              var parent = $jot(iframe).closest('.jt-feedback.u-responsive-lightbox');
              if (parent) {
                this.iframeDomId = 'lightbox-' + this.iframeDomId;
              }
            }
            var iframe = document.createElement('iframe');
            var titleEscaped = this.formId;
            var parentURL = window.location.href;
            var queryParameters = '';
            if (parentURL && parentURL.indexOf('?') > -1) {
              queryParameters = parentURL.substring(parentURL.indexOf('?') + 1).split('&');
              queryParameters = queryParameters.map(x => {
                const initialValue = x.substring(x.indexOf('=') + 1);
                const encodedValue = encodeURIComponent(decodeURIComponent(initialValue));
                return x.replace(initialValue, encodedValue);
              }).join('&');
            }
            queryParameters = \`?\${queryParameters ? \`\${queryParameters}&\` : ''}parentURL=\${encodeURIComponent(parentURL)}&jsForm=true\`;
            Object.entries(FrameBuilder.get).forEach(([key, value]) => {
              if (typeof value === 'object') {
                Object.entries(value).forEach(([valueKey, valueVal]) => {
                  valueVal = encodeURIComponent(valueVal);
                  queryParameters += \`&\${key}[\${valueKey}]=\${valueVal}\`;
                });
              } else {
                value = encodeURIComponent(value);
                queryParameters += \`&\${key}=\${value}\`;
              }
            });
            iframe.title = titleEscaped;
            iframe.src = \`https://form.jotform.com/251384614160048\${queryParameters}\`;
            iframe.allowtransparency = true;
            iframe.allow = 'geolocation; microphone; camera; fullscreen';
            iframe.name = this.formId;
            iframe.id = this.iframeDomId;
            iframe.style.width = '10px';
            iframe.style.minWidth = this.frameMinWidth;
            iframe.style.display = 'block';
            iframe.style.overflow = 'hidden';
            iframe.style.height = this.initialHeight + 'px';
            iframe.style.border = 'none';
            iframe.scrolling = 'no';
            if (this.appendTo === false) {
              var jsformScript = document.querySelector('script[src*="jsform/' + this.formId + '"]:not([data-iframe-appended])');
              var scriptLocatedInHead = !!jsformScript?.closest('head');
              if (scriptLocatedInHead) {
                var isBodyExists = !!document.body;
                if (isBodyExists) {
                  document.body.appendChild(iframe);
                } else {
                  document.addEventListener('DOMContentLoaded', function() {
                    if (document.body) {
                      document.body.appendChild(iframe);
                    } else {
                      console.log('No body element found to append the iframe');
                    }
                  });
                }
              } else if (jsformScript) {
                jsformScript.parentNode.insertBefore(iframe, jsformScript.nextSibling);
                jsformScript.dataset.iframeAppended = 'true';
              } else {
                document.getElementById('jotform-container')?.appendChild(iframe);
              }
            } else {
              document.getElementById(this.appendTo).appendChild(iframe);
            }
            this.formFrame = iframe;
            this.formFrame.addEventListener('load', () => {
              this.formFrameLoaded = true;
            });
            try {
              if ("LEGACY" === 'CARD') {
                this.tryInlineEmbed();
              }
            } catch (error) {
              console.error('Error with InlineEmbed', error);
            }
            try {
              const embeddedPlatform = this.getEmbeddedPlatform();
              if (embeddedPlatform) {
                const onLoad = () => {
                  if (!window.initPlatformEmbedHandler) {
                    console.error('initPlatformEmbedHandler not found on window');
                    return;
                  }
                  console.log('Platform embed UMD script loaded');
                  window.initPlatformEmbedHandler(embeddedPlatform, {
                    formId: platformEmbedParams.formId,
                    formType: "LEGACY",
                    isGuestOwner: platformEmbedParams.isGuestOwner
                  });
                };
                this.loadCDNScript(this.platformEmbedParams.umdUrl, onLoad);
              }
            } catch (error) {
              console.error('Error with platform embed', error);
            }
          };
          this.createFrame();
        }
        FrameBuilder.get = qsProxy || [];
        var initialHeight = "LEGACY" === 'CARD' ? 640 : 539;
        var i251384614160048 = new FrameBuilder("251384614160048", "jotform-container", initialHeight, "Form", [], {
          "umdUrl": "https://cdn.jotfor.ms/s/umd/6dd1c474429/for-platform-embed.js",
          "formId": 251384614160048,
          "isGuestOwner": false
        });
        var permittedDomains = [];
        try {
          var renderURLDomain = new URL("https://form.jotform.com/251384614160048").hostname;
          permittedDomains = [renderURLDomain];
        } catch (e) {
          permittedDomains = ['jotform.com', 'jotform.pro'];
        }
        (function() {
          window.handleIFrameMessage = function(e) {
            if (!e.data || !e.data.split) return;
            var args = e.data.split(":");
            if (args[2] != "251384614160048" || args[2] == "243183145891965") {
              return;
            }
            var iframe = document.getElementById("251384614160048");
            if (!iframe) {
              return;
            }
            switch (args[0]) {
              case "scrollIntoView":
                if (!("nojump" in FrameBuilder.get)) {
                  iframe.scrollIntoView();
                }
                break;
              case "setHeight":
                var height = args[1] + "px";
                if (window.jfDeviceType === 'mobile' && typeof $jot !== 'undefined') {
                  var parent = $jot(iframe).closest('.jt-feedback.u-responsive-lightbox');
                  if (parent) {
                    height = '100%';
                  }
                }
                iframe.style.height = height;
                break;
              case "setMinHeight":
                iframe.style.minHeight = args[1] + "px";
                break;
              case "collapseErrorPage":
                if (iframe.clientHeight > window.innerHeight) {
                  iframe.style.height = window.innerHeight + "px";
                }
                break;
              case "reloadPage":
                if (iframe) {
                  location.reload();
                }
                break;
              case "removeIframeOnloadAttr":
                iframe.removeAttribute("onload");
                break;
              case "loadScript":
                if (!window.isPermitted(e.origin, permittedDomains)) {
                  break;
                }
                var src = args[1];
                if (args.length > 3) {
                  src = args[1] + ':' + args[2];
                }
                var script = document.createElement('script');
                script.src = src;
                script.type = 'text/javascript';
                document.body.appendChild(script);
                break;
              case "exitFullscreen":
                if (window.document.exitFullscreen) window.document.exitFullscreen();
                else if (window.document.mozCancelFullScreen) window.document.mozCancelFullScreen();
                else if (window.document.mozCancelFullscreen) window.document.mozCancelFullscreen();
                else if (window.document.webkitExitFullscreen) window.document.webkitExitFullscreen();
                else if (window.document.msExitFullscreen) window.document.msExitFullscreen();
                break;
              case "setDeviceType":
                window.jfDeviceType = args[1];
                break;
              case "backgroundStyles":
                const backgroundStyles = new URLSearchParams(args[1]);
                backgroundStyles.forEach(function(value, key) {
                  iframe.style[key] = value;
                });
                var doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow.document || iframe.document);
                doc.documentElement.style.background = 'none';
                break;
            }
            var isJotForm = window.isPermitted(e.origin, permittedDomains);
            if (isJotForm && "contentWindow" in iframe && "postMessage" in iframe.contentWindow) {
              var urls = {
                "docurl": encodeURIComponent(document.URL),
                "referrer": encodeURIComponent(document.referrer)
              };
              iframe.contentWindow.postMessage(JSON.stringify({
                "type": "urls",
                "value": urls
              }), "*");
            }
          };
          window.isPermitted = function(originUrl, whitelisted_domains) {
            var result = false;
            try {
              var validOrigin = new URL(originUrl);
              if (validOrigin.protocol !== 'https:') {
                return result;
              }
              whitelisted_domains.forEach(function(element) {
                if (validOrigin.hostname.slice((-1 * element.length - 1)) === '.'.concat(element) || validOrigin.hostname === element) {
                  result = true;
                }
              });
              return result;
            } catch (err) {
              return result;
            }
          };
          window.addEventListener("message", handleIFrameMessage, false);
        })();
      `;
      formContainerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-blue/20">
      <h3 className="text-xl font-bold mb-6 font-heading text-kinder-blue">
        Send Us a Message
      </h3>
      <div
        id="jotform-container"
        ref={formContainerRef}
        className="relative w-full"
        style={{ minHeight: "640px" }}
      ></div>
    </div>
  );
}