import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Manga Boxd Logo"
              width={200}
              height={40}
              className={styles.logoImage}
            />
          </Link>

          {/* Right side - Auth buttons */}
          <div className={styles.buttons}>
            <Link href="/signin" className={styles.signInBtn}>
              Sign In
            </Link>
            <Link href="/register" className={styles.registerBtn}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}