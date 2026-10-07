export default async function handler(req, res) {
  const baseUrl = process.env.APPS_SCRIPT_URL;

  if (!baseUrl) {
    return res.status(500).json({
      success: false,
      message: "APPS_SCRIPT_URL belum diatur di Vercel."
    });
  }

  try {
    const response = await fetch(`${baseUrl}?action=test`);
    const data = await response.json();

    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghubungi Google Apps Script.",
      error: error.message
    });
  }
}
