import { Vault } from "@padloc/core/src/vault";
import { translate as $l } from "@padloc/locale/src/translate";
import { saveFile } from "@padloc/core/src/platform";
import { stringToBytes } from "@padloc/core/src/encoding";
import { CSV, PBES2 } from "../lib/import";
import { supportedFormats, asCSV, asPBES2Container } from "../lib/export";
import { app } from "../globals";
import { prompt } from "../lib/dialog";
import { Select } from "./select";
import { Dialog } from "./dialog";
import { html } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("pl-export-dialog")
export class ExportDialog extends Dialog<void, void> {
    @query("#formatSelect")
    private _formatSelect: Select<string>;
    @query("#vaultSelect")
    private _vaultSelect: Select<Vault>;

    renderContent() {
        return html`
            <div class="padded vertical spacing layout">
                <h1 class="big margined text-centering">${$l("Export Data")}</h1>

                <pl-select
                    id="vaultSelect"
                    .options=${app.vaults.map((v) => ({ value: v }))}
                    .label=${$l("Target Vault")}
                    @change=${() => this.requestUpdate()}
                >
                </pl-select>

                <pl-select
                    id="formatSelect"
                    .options=${supportedFormats}
                    .label=${$l("Format")}
                    @change=${() => this.requestUpdate()}
                ></pl-select>

                <div class="small padded" ?hidden=${this._formatSelect && this._formatSelect.value !== CSV.value}>
                    ${$l(
                        "WARNING: Exporting to CSV format will save your data without encyryption of any " +
                            "kind which means it can be read by anyone. We strongly recommend exporting your data as " +
                            "a secure, encrypted file, instead!"
                    )}
                </div>

                <div class="horizontal evenly stretching spacing layout">
                    <pl-button class="primary" @click=${() => this._export()}>
                        ${$l("Export {0} Items", this._vaultSelect?.value?.items.size.toString() || "0")}
                    </pl-button>
                    <pl-button @click=${this.dismiss}> ${$l("Cancel")} </pl-button>
                </div>
            </div>
        `;
    }

    async show() {
        await this.updateComplete;
        this._formatSelect.value = PBES2.value;
        this._vaultSelect.value = app.mainVault!;
        return super.show();
    }

    private async _export() {
        const vault = this._vaultSelect.value!;
        const items = [...vault.items];

        const date = new Date().toISOString().substr(0, 10);
        let data = "";
        let fileName = "";
        let type = "text/plain";

        switch (this._formatSelect.value) {
            case CSV.value:
                data = await asCSV(items);
                fileName = `${vault.name.replace(/ /g, "_")}_${date}.csv`;
                type = "text/csv";
                break;

            case PBES2.value:
                this.open = false;
                const password = await prompt($l("Please choose a password to protect this backup with!"), {
                    title: $l("Choose Password"),
                    type: "password",
                    placeholder: "Enter Password",
                    validate: async (val) => {
                        if (!val) {
                            throw $l("Please choose a password!");
                        }
                        return val;
                    },
                });

                if (!password) {
                    this.open = true;
                    return;
                }

                const repeated = await prompt($l("Please repeat the password!"), {
                    title: $l("Choose Password"),
                    type: "password",
                    placeholder: "Repeat Password",
                    validate: async (val) => {
                        if (val !== password) {
                            throw $l("Password not repeated correctly!");
                        }
                        return val;
                    },
                });

                if (!repeated) {
                    this.open = true;
                    return;
                }

                data = await asPBES2Container(items, password);
                fileName = `${vault.name.replace(/ /g, "_")}_${date}.pbes2`;
                break;

            default:
                return;
        }
        saveFile(fileName, type, stringToBytes(data));
        this.done();
    }
}
