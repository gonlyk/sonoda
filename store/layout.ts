import { observable, runInAction } from "mobx";

export const layoutData = observable({
  showFooterHint: false,
  footerHint: ''
})

export function showHint(show: boolean, hint = '') {
  runInAction(() => {
    layoutData.showFooterHint = show
    layoutData.footerHint = hint
  })
}