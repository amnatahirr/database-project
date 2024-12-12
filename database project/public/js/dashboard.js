const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login';
}

// Decode the token to get user info (this is a simple decode, not a verification)
const user = JSON.parse(atob(token.split('.')[1]));

if (user.role === 'jobSeeker') {
    document.getElementById('jobSeekerSection').style.display = 'block';
    loadJobs();
    loadMyApplications();
} else if (user.role === 'employer') {
    document.getElementById('employerSection').style.display = 'block';
    loadPostedJobs();
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
});

async function loadJobs() {
    try {
        const response = await fetch('/api/jobs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const jobs = await response.json();
        const jobListings = document.getElementById('jobListings');
        jobListings.innerHTML = jobs.map(job => `
            <div class="job">
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p>Location: ${job.location}</p>
                <button onclick="applyForJob('${job._id}')">Apply</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

async function loadMyApplications() {
    try {
        const response = await fetch(`/api/application/user/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const applications = await response.json();
        const myApplications = document.getElementById('myApplications');
        myApplications.innerHTML = applications.map(app => `
            <div class="application">
                <p>Job: ${app.jobId.title}</p>
                <p>Status: ${app.status}</p>
                <p>Applied on: ${new Date(app.appliedDate).toLocaleDateString()}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading applications:', error);
    }
}

async function applyForJob(jobId) {
    try {
        const response = await fetch('/api/application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ jobId, applicantId: user.id })
        });
        const result = await response.json();
        if (response.ok) {
            alert('Application submitted successfully!');
            loadMyApplications();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error applying for job:', error);
        alert('An error occurred. Please try again.');
    }
}

async function loadPostedJobs() {
    try {
        const response = await fetch('/api/jobs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const jobs = await response.json();
        const postedJobs = document.getElementById('postedJobs');
        postedJobs.innerHTML = jobs.map(job => `
            <div class="job">
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p>Location: ${job.location}</p>
                <button onclick="editJob('${job._id}')">Edit</button>
                <button onclick="deleteJob('${job._id}')">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading posted jobs:', error);
    }
}

document.getElementById('postJobBtn').addEventListener('click', () => {
    // Implement job posting functionality
});

function editJob(jobId) {
    // Implement job editing functionality
}

async function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        try {
            const response = await fetch(`/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                alert('Job deleted successfully');
                loadPostedJobs();
            } else {
                const result = await response.json();
                alert(result.message);
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('An error occurred. Please try again.');
        }
    }
}

