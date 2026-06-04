// ═══════════════════════════════════════════════════
// LoginModal — the access tunnel as a landing overlay
//
// WHAT: Renders the shared <LoginPanel/> inside a Modal so sign-in opens
//       OVER the landing instead of replacing the page. Same flow as the
//       /login route (which renders the identical panel) — the only
//       difference is the frame and where we navigate after success.
// WHEN: Mounted by LoginModalProvider, controlled via useLoginModal().
// EDIT COPY: src/locales/{fr,en}.json under auth.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Modal } from '@components/ui/Modal';
import { ROUTES } from '@constants/routes';
import { LoginPanel } from '@features/access/LoginPanel';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { localePath } = useLocale();
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="p-1">
        <LoginPanel
          onRegistered={() => {
            onClose();
            void navigate(localePath(ROUTES.ONBOARDING), { replace: true });
          }}
          onSignedIn={() => {
            onClose();
            void navigate(localePath(ROUTES.ACCOUNT), { replace: true });
          }}
        />
      </div>
    </Modal>
  );
};
