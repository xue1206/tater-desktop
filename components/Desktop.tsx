import { useUser } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { useSettingsValue } from "../contexts/settings"
import Site from "../modules/Site"
import useDaiDaiStore from "../store/daidai"
import DaidaiObject from "../store/DaidaiObject"
import {
  PannelConfig,
  PANNELS,
  PANNEL_CREATOR,
  PANNEL_DELETER,
  PANNEL_EDITOR,
  PANNEL_IMPORTER,
  PANNEL_PROFILE,
  PANNEL_SHORTCUTS,
} from "../utils/pannel"
import { authToast, TOAST_CONFIG } from "../utils/toast"
import BookmarkImporter from "./BookmarkImporter"
import DaidaiObjectDeleter from "./DaidaiObjectDeleter"
import { DaidaiObjectCreator, DaidaiObjectEditor } from "./DaidaiObjectForm"
import Dock from "./Dock"
import ObjectEditor from "./ObjectEditor/ObjectEditor"
import Profile from "./Profile"
import Settings from "./Settings"
import ShortcutManualPopup from "./ShotcutsManual"
import Sites from "./Sites"
import Tags from "./Tags"
import TypeBox from "./TypeBox"

const Desktop: React.FC = ({}) => {
  const { user, isLoading } = useUser()
  const initData = useDaiDaiStore((state) => state.initDatda)
  const router = useRouter()
  const pannel = router.query.pannel

  const daidaiObjectIndex = useMemo(() => {
    const maybeStringIndex = Array.isArray(router.query.index)
      ? router.query.index[0]
      : router.query.index
    return maybeStringIndex === undefined ? maybeStringIndex : +maybeStringIndex
  }, [router.query.index])

  const pannelCanShow = (pannelConfig: PannelConfig) =>
    (pannelConfig[1] || user !== null) && pannel === pannelConfig[0]

  const controlDisabled = typeof pannel === "string"

  const onClosePannel = router.back

  // prevent nextjs default scroll behavior
  useEffect(() => {
    router.beforePopState((state) => {
      state.options.scroll = false
      return true
    })
    return () => {
      router.beforePopState((state) => true)
    }
  }, [router])

  useEffect(() => {
    if (isLoading) return
    if (user) {
      initData(user).catch((e) => {
        toast.error("Should login first!", TOAST_CONFIG)
        console.error(e)
      })
    } else {
      initData(null)
    }
  }, [initData, user, isLoading])

  useEffect(() => {
    const inPannelDonotSupportAnonymousButAnonymousNow = PANNELS.some(
      ([name, supportAnonymous]) => name === pannel && !supportAnonymous && user === null
    )
    if (inPannelDonotSupportAnonymousButAnonymousNow) {
      authToast()
    }
  }, [pannel, user])

  return (
    <div className="p-2">
      {/* <Settings></Settings> */}
      {!controlDisabled && <TypeBox />}
      <Tags></Tags>
      <Sites disabled={controlDisabled}></Sites>
      <Dock />
      <DaidaiObjectCreator show={pannelCanShow(PANNEL_CREATOR)} onClose={onClosePannel} />
      <DaidaiObjectEditor
        index={daidaiObjectIndex}
        show={pannelCanShow(PANNEL_EDITOR)}
        onClose={onClosePannel}
      />
      <DaidaiObjectDeleter
        index={daidaiObjectIndex}
        show={pannelCanShow(PANNEL_DELETER)}
        onClose={onClosePannel}
      />
      <BookmarkImporter show={pannelCanShow(PANNEL_IMPORTER)} onClose={onClosePannel} />
      <Profile show={pannelCanShow(PANNEL_PROFILE)} onClose={onClosePannel} />
      <ShortcutManualPopup show={pannelCanShow(PANNEL_SHORTCUTS)} onClose={onClosePannel} />
    </div>
  )
}

export default Desktop
