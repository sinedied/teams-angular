import { Injectable } from '@angular/core';
import * as microsoftTeams from "@microsoft/teams-js";

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private teamsContext?: microsoftTeams.Context | null;

  // from https://github.com/wictorwilen/msteams-react-base-component/blob/c3d941e3467365c23d8e8f4f2c067c4b0eb6a032/src/useTeams.ts#L10
  private checkInTeams() {
    // eslint-disable-next-line dot-notation
    const microsoftTeamsLib = microsoftTeams || window["microsoftTeams"];

    if (!microsoftTeamsLib) {
      return false; // the Microsoft Teams library is for some reason not loaded
    }

    if ((window.parent === window.self && (window as any).nativeInterface) ||
      window.navigator.userAgent.includes("Teams/") ||
      window.name === "embedded-page-container" ||
      window.name === "extension-tab-frame") {
      return true;
    }
    return false;
  }

  async inTeams() {
    return new Promise<boolean>((resolve) => {
      if (this.checkInTeams()) {
        microsoftTeams.initialize(() => {
          microsoftTeams.getContext((context) => {
            this.teamsContext = context;
            resolve(true);
          });
        });
      }
      else {
        microsoftTeams.initialize();
        resolve(false);
      }
    });
  }
}
