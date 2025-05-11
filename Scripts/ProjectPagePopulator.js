// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
  // Parse query parameters from the current URL
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  // If no project ID is provided in the URL, log an error and stop execution
if (!projectId) {
    console.error("No project ID in URL.");
    return;
}
  // Fetch project data from the JSON file
  fetch('../Data/PersonalProjects.json')
    .then(response => response.json())
    .then(projects => {
      // Find the project object with a matching ID
      const project = projects.find(p => p.ID === projectId);
      
      // If the project is not found, log an error and stop execution
      if (!project) {
        console.error("Project not found.");
        return;
      }

      // Set the page title to the project's title
      document.title = project.Title;

      // Populate elements
      document.getElementById('ProjectVideo').src = project.VideoPath;
      document.getElementById('ProjectTitle').textContent = project.Title;

      document.getElementById('RoleDetail').textContent = project.Role;
      document.getElementById('SizeDetail').textContent = project.TeamSize;
      document.getElementById('TimeDetail').textContent = project.DevelopmentTime;
      document.getElementById('EngineDetail').textContent = project.Engine;
      document.getElementById('LanguageDetail').textContent = project.Language;

      document.getElementById('PlatformDetail').textContent = project.Platform;
      document.getElementById('GenreDetail').textContent = project.Genre;
      document.getElementById('PerspectiveDetail').textContent = project.Perspective;
      document.getElementById('StatusDetail').textContent = project.Status;

      document.getElementById('ConceptDetail').textContent = project.Concept;

      document.getElementById('SuperClassDetail').textContent = project.SuperClass;

      document.getElementById('RecapDetail').textContent = project.Recap;
    })
    // Log any errors that occur during the fetch or processing
    .catch(error => console.error('Error loading project details:', error));
});