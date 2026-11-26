"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const NOTICE_KEY = "tributai-cookie-notice";
const CHANGE_EVENT = "tributai-cookie-notice-change";
let storageUnavailableLogged = false;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(NOTICE_KEY) !== "closed";
  } catch (error) {
    if (!storageUnavailableLogged) {
      console.error("Não foi possível ler a preferência do aviso de cookies.", error);
      storageUnavailableLogged = true;
    }
    return true;
  }
}

function getServerSnapshot() {
  return false;
}

export default function CookieNotice() {
  const [dismissedInMemory, setDismissedInMemory] = useState(false);
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) && !dismissedInMemory;

  function dismiss() {
    setDismissedInMemory(true);
    try {
      window.localStorage.setItem(NOTICE_KEY, "closed");
    } catch (error) {
      console.error("Não foi possível salvar a preferência do aviso de cookies.", error);
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Aviso sobre cookies e armazenamento local"
      className="fixed bottom-4 left-4 right-20 z-[70] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--foreground)] shadow-xl sm:right-24 sm:max-w-xl"
    >
      <p className="text-sm leading-6">
        Usamos armazenamento técnico para autenticação e para lembrar preferências locais. Não
        identificamos analytics ou pixels de publicidade ativos nesta versão.{" "}
        <Link href="/cookies" className="font-semibold text-[var(--blue)] underline">
          Saiba mais
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 min-h-10 rounded-lg bg-[var(--navy)] px-4 text-sm font-bold text-white"
      >
        Fechar aviso
      </button>
    </aside>
  );
}
