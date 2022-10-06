import { useUser } from "@supabase/auth-helpers-react"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  PannelConfig,
  PANNEL_CREATOR,
  PANNEL_IMPORTER,
  PANNEL_PROFILE,
  PANNEL_SHORTCUTS,
} from "../utils/pannel"
import Button, { LinkButton } from "./Common/Button"
import {
  CarbonWorkspaceImport,
  MaterialSymbolsAddBoxOutlineSharp,
  MaterialSymbolsKeyboardSharp,
  NavLogo,
  NavLogoClosed,
  RiUser3Line,
} from "./Common/icons"
import clsx from "classnames"
import { useMeasure } from "react-use"

const getGroupParent = (elem: HTMLElement): HTMLElement | null => {
  return !elem || elem === document.body
    ? document.body
    : elem.classList.contains("group")
    ? elem
    : elem.parentElement
    ? getGroupParent(elem.parentElement)
    : null
}

const CollpasedLabel = ({ children }: { children: React.ReactNode }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const groupEl = getGroupParent(wrapper)
    if (!groupEl) return
    groupEl.style.setProperty("--mywidth", `${width}px`)
  }, [width])
  return (
    <div
      ref={wrapperRef}
      className="w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all group-hover:w-[var(--mywidth)] group-hover:opacity-100"
    >
      <div ref={ref} className="w-fit">
        {children}
      </div>
    </div>
  )
}

type DockProps = {
  children?: React.ReactNode
}

const Dock = (props: DockProps) => {
  const { user } = useUser()
  const shouldReplace = (pannelConfig: PannelConfig) => !pannelConfig[1] && user === null

  const [showAll, setShowAll] = useState(true)

  return (
    <div
      className={clsx(
        "fixed right-0 top-4 flex items-center handlebar pr-2",
        showAll ? "bounce-in-right" : "bounce-in-left"
      )}
    >
      <Button
        className="text-base"
        onClick={() => {
          setShowAll((v) => !v)
        }}
      >
        {showAll ? <NavLogo /> : <NavLogoClosed />}
      </Button>
      <LinkButton
        href={`/?pannel=${PANNEL_CREATOR[0]}`}
        shallow
        replace={shouldReplace(PANNEL_CREATOR)}
        className="group flex items-center gap-1 pr-2"
      >
        <MaterialSymbolsAddBoxOutlineSharp className="text-lg" />
        <CollpasedLabel>Add</CollpasedLabel>
      </LinkButton>
      <LinkButton
        href={`/?pannel=${PANNEL_IMPORTER[0]}`}
        shallow
        replace={shouldReplace(PANNEL_IMPORTER)}
        className="group flex items-center gap-1 pr-2"
      >
        <CarbonWorkspaceImport className="text-lg" />
        <CollpasedLabel>Import Chrome Bookmarks</CollpasedLabel>
      </LinkButton>
      <LinkButton
        href={`/?pannel=${PANNEL_SHORTCUTS[0]}`}
        shallow
        replace={shouldReplace(PANNEL_SHORTCUTS)}
        className="group flex items-center gap-1 pr-2"
      >
        <MaterialSymbolsKeyboardSharp className="text-lg" />
        <CollpasedLabel>Shortcuts</CollpasedLabel>
      </LinkButton>
      {user ? (
        <LinkButton
          href={`/?pannel=${PANNEL_PROFILE[0]}`}
          shallow
          replace={shouldReplace(PANNEL_PROFILE)}
          className="group flex items-center gap-1 pr-2"
        >
          <RiUser3Line className="text-lg" />
          <CollpasedLabel>Profile</CollpasedLabel>
        </LinkButton>
      ) : (
        <>
          <LinkButton href="/signin">Sign in</LinkButton>
          <LinkButton className="btn-accent" href="/signup">
            Get Daidai free
          </LinkButton>
        </>
      )}
    </div>
  )
}

export default Dock
