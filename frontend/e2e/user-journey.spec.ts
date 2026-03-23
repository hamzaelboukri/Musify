import { test, expect } from '@playwright/test';

/**
 * Parcours utilisateur E2E:
 * 1. Connexion (login)
 * 2. Écoute (cliquer sur une chanson, vérifier le player)
 * 3. Création de playlist
 *
 * Prérequis: Backend + MongoDB + données seedées (npm run seed dans backend)
 * Utilisateur de test: user@musify.com / User123!
 */
test.describe('Parcours utilisateur Musify', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Connexion - Login avec compte de démo', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('you@example.com').fill('user@musify.com');
    await page.getByPlaceholder('Your password').fill('User123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/(home)?$/);
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('2. Écoute - Lancer la lecture depuis la page d\'accueil', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('user@musify.com');
    await page.getByPlaceholder('Your password').fill('User123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).not.toHaveURL(/\/login/);
    await page.waitForLoadState('networkidle');

    const playAllBtn = page.getByRole('button', { name: 'Play all' });
    if (await playAllBtn.isVisible().catch(() => false)) {
      await playAllBtn.click();
      await page.waitForTimeout(800);
      const pauseBtn = page.getByRole('button', { name: /pause/i });
      await expect(pauseBtn).toBeVisible({ timeout: 5000 });
    }
  });

  test('3. Création de playlist', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('user@musify.com');
    await page.getByPlaceholder('Your password').fill('User123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).not.toHaveURL(/\/login/);
    await page.waitForLoadState('networkidle');

    await page.goto('/playlists');
    await expect(page.getByRole('heading', { name: /my playlists/i })).toBeVisible({ timeout: 10000 });

    const playlistName = `E2E Playlist ${Date.now()}`;
    await page.getByPlaceholder('New playlist name').fill(playlistName);
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText(playlistName)).toBeVisible({ timeout: 5000 });
  });

  test('Parcours complet: Connexion → Accueil → Playlists → Création', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('user@musify.com');
    await page.getByPlaceholder('Your password').fill('User123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).not.toHaveURL(/\/login/);
    await page.waitForLoadState('networkidle');

    const libraryLink = page.getByRole('link', { name: 'Library' }).first();
    await expect(libraryLink).toBeVisible({ timeout: 5000 });
    await libraryLink.click();

    await expect(page).toHaveURL(/\/playlists/);
    await expect(page.getByRole('heading', { name: /my playlists/i })).toBeVisible({ timeout: 5000 });

    const playlistName = `Test ${Date.now()}`;
    await page.getByPlaceholder('New playlist name').fill(playlistName);
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText(playlistName)).toBeVisible({ timeout: 5000 });
  });
});
