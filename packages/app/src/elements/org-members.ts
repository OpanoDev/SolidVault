import { translate as $l } from "@padloc/locale/src/translate";
import { OrgMember } from "@padloc/core/src/org";
import { StateMixin } from "../mixins/state";
import { Routing } from "../mixins/routing";
import { dialog, alert } from "../lib/dialog";
import { app } from "../globals";
import { shared } from "../styles";
import { Input } from "./input";
import { CreateInvitesDialog } from "./create-invites-dialog";
import "./member-item";
import "./icon";
import "./member-view";
import "./list";
import "./org-nav";
import { customElement, property, query, state } from "lit/decorators.js";
import { html, LitElement } from "lit";

@customElement("pl-org-members")
export class OrgMembersView extends Routing(StateMixin(LitElement)) {
    readonly routePattern = /^orgs\/([^\/]+)\/members(?:\/([^\/]+))?/;

    @property()
    orgId: string = "";

    @property()
    memberId?: string;

    @query("#filterInput")
    private _filterInput: Input;

    @dialog("pl-create-invites-dialog")
    private _createInvitesDialog: CreateInvitesDialog;

    private get _org() {
        return app.getOrg(this.orgId);
    }

    @state()
    private _filter: string = "";

    @state()
    private _filterActive: boolean = false;

    handleRoute([orgId, memberId]: [string, string]) {
        this.orgId = orgId;
        this.memberId = memberId;
    }

    private async _createInvite() {
        const invites = await this._createInvitesDialog.show(this._org!);
        if (invites) {
            if (invites.length === 1) {
                this.go(`orgs/${this.orgId}/invites/${invites[0].id}`);
            } else {
                alert($l("Successfully created {0} invites!", invites.length.toString()));
            }
        }
    }

    private _updateFilter() {
        this._filter = this._filterInput.value;
    }

    private async _toggleMember(member: OrgMember) {
        if (this.memberId === member.id) {
            this.go(`orgs/${this.orgId}/members/`);
        } else {
            this.go(`orgs/${this.orgId}/members/${member.id}`);
        }
    }

    private _clearFilter() {
        this._filter = this._filterInput.value = "";
        this._filterActive = false;
    }

    private async _showFilter() {
        this._filterActive = true;
        await this.updateComplete;
        this._filterInput.focus();
    }

    static styles = [shared];

    render() {
        if (!this._org) {
            return;
        }

        const org = this._org!;
        const isOwner = org.isOwner(app.account!);
        const memFilter = this._filter.toLowerCase();
        const members = memFilter
            ? org.members.filter(
                  ({ name, email }) => email.toLowerCase().includes(memFilter) || name.toLowerCase().includes(memFilter)
              )
            : org.members;

        return html`
            <div class="fullbleed pane layout background ${this.memberId ? "open" : ""}">
                <div class="vertical layout">
                    <header class="padded center-aligning horizontal layout" ?hidden=${this._filterActive}>
                        <pl-org-nav></pl-org-nav>

                        <div class="stretch"></div>

                        <pl-button class="transparent" @click=${() => this._showFilter()}>
                            <pl-icon icon="search"></pl-icon>
                        </pl-button>

                        <pl-button class="transparent" @click=${() => this._createInvite()} ?disabled=${!isOwner}>
                            <pl-icon icon="add"></pl-icon>
                        </pl-button>
                    </header>

                    <header class="padded" ?hidden=${!this._filterActive}>
                        <pl-input
                            class="transparent slim dashed"
                            id="filterInput"
                            placeholder="${$l("Search...")}"
                            @input=${this._updateFilter}
                        >
                            <pl-icon icon="search" slot="before" class="left-margined"></pl-icon>
                            <pl-button class="slim transparent" slot="after" @click=${this._clearFilter}>
                                <pl-icon icon="cancel"></pl-icon>
                            </pl-button>
                        </pl-input>
                    </header>

                    <pl-scroller class="stretch">
                        <pl-list>
                            ${members.map(
                                (member) => html`
                                    <div
                                        class="double-padded list-item hover click"
                                        aria-selected=${member.id === this.memberId}
                                        @click=${() => this._toggleMember(member)}
                                    >
                                        <pl-member-item .member=${member} .org=${this._org}></pl-member-item>
                                    </div>
                                `
                            )}
                        </pl-list>
                    </pl-scroller>
                </div>

                <pl-member-view></pl-member-view>
            </div>
        `;
    }
}
