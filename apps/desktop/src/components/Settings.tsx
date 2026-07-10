import { useEffect } from "react";
import { aiProviders } from "../ai/registry";
import { useApiKeyStore } from "../state/apiKeys";
import { useSettingsStore } from "../state/settings";
import { useUiStore } from "../state/ui";

export function Settings() {
  const setView = useUiStore((s) => s.setView);
  const providerSettings = useSettingsStore((s) => s.providers);
  const updateProviderSettings = useSettingsStore((s) => s.updateProviderSettings);
  const keys = useApiKeyStore((s) => s.keys);
  const loadKey = useApiKeyStore((s) => s.loadKey);
  const setKey = useApiKeyStore((s) => s.setKey);

  useEffect(() => {
    for (const provider of aiProviders) {
      if (provider.requiresApiKey) {
        loadKey(provider.id);
      }
    }
  }, [loadKey]);

  return (
    <div className="settings-view">
      <header className="settings-header">
        <button className="back-button" onClick={() => setView("library")}>
          ← Back
        </button>
        <h1>Settings</h1>
      </header>

      <div className="settings-body">
        <h2>AI providers</h2>
        <p className="settings-hint">
          API keys are stored in your OS keychain, never in plain text. Leave blank for providers
          you don't use.
        </p>

        {aiProviders.map((provider) => {
          const settings = providerSettings[provider.id] ?? {};
          return (
            <div key={provider.id} className="settings-provider-card">
              <h3>{provider.label}</h3>
              <div className="settings-field-grid">
                {provider.requiresApiKey && (
                  <label>
                    API key
                    <input
                      type="password"
                      value={keys[provider.id] ?? ""}
                      onChange={(e) => setKey(provider.id, e.currentTarget.value)}
                      placeholder="sk-…"
                    />
                  </label>
                )}
                <label>
                  Model
                  <input
                    type="text"
                    value={settings.model ?? ""}
                    onChange={(e) =>
                      updateProviderSettings(provider.id, { model: e.currentTarget.value })
                    }
                    placeholder="default"
                  />
                </label>
                {!provider.requiresApiKey && (
                  <label>
                    Base URL
                    <input
                      type="text"
                      value={settings.baseUrl ?? ""}
                      onChange={(e) =>
                        updateProviderSettings(provider.id, { baseUrl: e.currentTarget.value })
                      }
                      placeholder="http://localhost:11434"
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
