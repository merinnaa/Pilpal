
import React from 'react';
import Footer from '../components/Footer';
import '../styles/home.scss';

export default function Home({ login, signup }) {
  return (
    <div className="">
      <header className='header'>
        <nav className="nav">
          <div className="logo">
            <h1>Pilpal</h1> <span >✷</span>
            </div>
          <ul className="nav-container--left">
            <li onClick={signup}>Signup</li>
            <li onClick={login}>Login</li>
          </ul>
        </nav>
      </header>

      <main className="dashboard-container container">
        <section className="container-top">
          <h1 >
            Welcome to Pilpal<span>✷</span>
          </h1>
          <h2>Your Health, Our Priority</h2>
        </section>
        <section className="container-bottom">
          <article className="container-left">
            <h3>Your personal supplement and health reminder app.</h3>
            <p>Keep track of your supplements and stay healthy effortlessly.</p>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}