const API_BASE = 'https://api.github.com';

interface GhFileResponse {
  sha: string;
  content: string;
}

function repoInfo() {
  const repo = process.env.GITHUB_REPO; // "owner/name"
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;
  return { repo, branch, token };
}

export function isGithubConfigured(): boolean {
  const { repo, token } = repoInfo();
  return Boolean(repo && token);
}

export async function getFile(repoPath: string): Promise<{ content: string; sha: string } | null> {
  const { repo, branch, token } = repoInfo();
  if (!repo || !token) return null;

  const res = await fetch(`${API_BASE}/repos/${repo}/contents/${repoPath}?ref=${encodeURIComponent(branch)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'techpulse-admin-cms',
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as GhFileResponse;
  return { content: Buffer.from(data.content, 'base64').toString('utf8'), sha: data.sha };
}

export async function putFile(repoPath: string, content: string, message: string): Promise<void> {
  const { repo, branch, token } = repoInfo();
  if (!repo || !token) throw new Error('GitHub is not configured (missing GITHUB_REPO/GITHUB_TOKEN)');

  const existing = await getFile(repoPath);

  const res = await fetch(`${API_BASE}/repos/${repo}/contents/${repoPath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'techpulse-admin-cms',
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      branch,
      sha: existing?.sha,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
  }
}
