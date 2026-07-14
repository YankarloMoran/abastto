const https = require('https');

const projects = [
  {
    name: 'Abastto',
    url: 'https://wpnhjgfnntvbdzmiilyd.supabase.co/auth/v1/health',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbmhqZ2ZubnR2YmR6bWlpbHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzAxNDEsImV4cCI6MjA4Njc0NjE0MX0.VLK1sILquw5BrEKulOvjzwUDil3CQLczWjcN0__nw0Q'
  },
  {
    name: 'Karta',
    url: 'https://saicmwqgfhpwuyxckdnw.supabase.co/auth/v1/health',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhaWNtd3FnZmhwd3V5eGNrZG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NTI0MDUsImV4cCI6MjA5MDMyODQwNX0.ydcdL88knPuyflI5DQ5T9D8-4OgfsOt4Vmkr8KSQagk'
  }
];

async function pingProject(project) {
  return new Promise((resolve) => {
    console.log(`Sending ping to ${project.name}...`);
    
    const url = new URL(project.url);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      headers: {
        'apikey': project.apiKey
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`[${project.name}] Response: ${res.statusCode} OK`);
        resolve(true);
      });
    });

    req.on('error', (e) => {
      console.error(`[${project.name}] Error: ${e.message}`);
      resolve(false);
    });

    req.end();
  });
}

async function run() {
  for (const project of projects) {
    await pingProject(project);
  }
  console.log('All pings completed successfully!');
}

run();
