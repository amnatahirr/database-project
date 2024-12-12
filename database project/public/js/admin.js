document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
    }

    loadUsers();
    loadJobs();
    loadReports();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    });
});

async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        const userList = document.getElementById('userList');
        userList.innerHTML = users.map(user => `
            <div class="user">
                <p>Name: ${user.name}</p>
                <p>Email: ${user.email}</p>
                <p>Role: ${user.role}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Failed to load users. Please try again.');
    }
}

async function loadJobs() {
    try {
        const response = await fetch('/api/admin/jobs', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const jobs = await response.json();
        const jobList = document.getElementById('jobList');
        jobList.innerHTML = jobs.map(job => `
            <div class="job">
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p>Location: ${job.location}</p>
                <button onclick="deleteJob('${job._id}')">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading jobs:', error);
        alert('Failed to load jobs. Please try again.');
    }
}

async function loadReports() {
    try {
        const response = await fetch('/api/admin/reports', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch reports');
        const reports = await response.json();
        const reportData = document.getElementById('reportData');
        reportData.innerHTML = `
            <p>Total Users: ${reports.totalUsers}</p>
            <p>Total Jobs: ${reports.totalJobs}</p>
            <p>Total Applications: ${reports.totalApplications}</p>
            <p>Most Applied Job: ${reports.mostAppliedJob[0]?._id || 'N/A'} (${reports.mostAppliedJob[0]?.count || 0} applications)</p>
        `;
    } catch (error) {
        console.error('Error loading reports:', error);
        alert('Failed to load reports. Please try again.');
    }
}

async function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        try {
            const response = await fetch(`/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete job');
            alert('Job deleted successfully');
            loadJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job. Please try again.');
        }
    }
}

