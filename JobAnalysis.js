document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jobs = JSON.parse(e.target.result);
                const jobList = document.getElementById('jobList');
                const jobTypeFilter = document.getElementById('jobTypeFilter');
                const jobSkillFilter = document.getElementById('jobSkillFilter');
                const jobLevelFilter = document.getElementById('jobLevelFilter');
                const sorts = document.getElementById('Sort');
                sorts.innerHTML = ' <option value="none">none</option><option value="a-z">Title(A-Z)</option><option value="z-a">Title(Z-A)</option>'
                jobList.innerHTML = ''; // Clear job list
                jobTypeFilter.innerHTML = '<option value="all">All Types</option>'; // Reset filter options
                jobSkillFilter.innerHTML = '<option value="all">All Skills</option>';
                jobLevelFilter.innerHTML = '<option value="all">All Levels</option>';
                

                // Create job instances
                let jobInstances = jobs.map(job => new Job(
                    job["Job No"], job["Title"], job["Job Page Link"],
                    job["Posted"], job["Type"], job["Level"],
                    job["Estimated Time"], job["Skill"], job["Detail"]
                ));

                // Populates the job type filter dropdown
                const jobTypes = [...new Set(jobInstances.map(job => job.type))];
                jobTypes.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    jobTypeFilter.appendChild(option);
                });

                // Populates the skill filter dropdown
                const skills = [...new Set(jobInstances.map(job => job.skill))];
                skills.forEach(skill => {
                    const option = document.createElement('option');
                    option.value = skill;
                    option.textContent = skill;
                    jobSkillFilter.appendChild(option);
                });

                // Populates the level filter dropdown
                const levels = [...new Set(jobInstances.map(job => job.level))];
                levels.forEach(level => {
                    const option = document.createElement('option');
                    option.value = level;
                    option.textContent = level;
                    jobLevelFilter.appendChild(option);
                });

                // Function to display jobs
                function displayJobs(jobsToDisplay) {
                    jobList.innerHTML = ''; // Clear current list
                    jobsToDisplay.forEach(job => {
                        const jobElement = document.createElement('div');
                        jobElement.className = 'job-click';
                        jobElement.innerHTML = `
                            <strong>${job.Title}</strong> - 
                            <strong>${job.type}</strong> 
                            <strong>(${job.skill})</strong>
                        `;
                        jobElement.addEventListener('click', () => job.Popup());
                        jobList.appendChild(jobElement);
                    });
                }

                // Function to filter and display jobs
                function filterJobs() {
                    const selectedType = jobTypeFilter.value;
                    const selectedSkill = jobSkillFilter.value;
                    const selectedLevel = jobLevelFilter.value;

                    const filteredJobs = jobInstances.filter(job => {
                        const matchesType = selectedType === 'all' || job.type === selectedType;
                        const matchesSkill = selectedSkill === 'all' || job.skill === selectedSkill;
                        const matchesLevel = selectedLevel === 'all' || job.level === selectedLevel;
                        return matchesType && matchesSkill && matchesLevel;
                    });

                    sortJobs(filteredJobs); // sorts jobs if selected
                }

                function sortJobs(JobToSort){
                    const sortJob = [...JobToSort];
                    const s = sorts.value;

                    if(s == 'a-z'){
                        sortJob.sort((a,b)=>a.Title.localeCompare(b.Title));
                       
                    } else if(s == 'z-a'){
                        sortJob.sort((a,b)=>a.Title.localeCompare(b.Title));

                        sortJob.reverse();
                    } 
                    
                    displayJobs(sortJob);
                }

                

                // Attach filter change event listeners
                jobTypeFilter.addEventListener('change', filterJobs); // filter for Jobs
                jobSkillFilter.addEventListener('change', filterJobs); // filter for skill
                jobLevelFilter.addEventListener('change', filterJobs); // filter for level
                sorts.addEventListener('change',() => {filterJobs()}); // sorting filter

                // Initially display all jobs
                displayJobs(jobInstances);

            } catch (error) {
                alert('Error: Invalid JSON format or unexpected issue.');
            }
        };

        reader.onerror = function() {
            alert('Error: Unable to read file');
        };
        reader.readAsText(file);

    } else {
        alert('No file selected');
    }
});

// Job class 
class Job {
    constructor(JobNum, Title, link, posted, type, level, est, skill, detail) {
        this.JobNum = JobNum;
        this.Title = Title;
        this.link = link;
        this.posted = posted;
        this.type = type;
        this.level = level;
        this.est = est;
        this.skill = skill;
        this.detail = detail;
    }

    Popup() { // popup function for jobs
        const popupText = document.getElementById('popupText');
        const popup = document.getElementById('popup');

        popupText.innerHTML = `
            <strong>Title:</strong> ${this.Title}<br>
            <strong>Type:</strong> ${this.type}<br>
            <strong>Level:</strong> ${this.level}<br>
            <strong>Skill:</strong> ${this.skill}<br>
            <strong>Job Details:</strong> ${this.detail}
        `;
        popup.style.display = 'block';
    }
}

// closes the popup made
document.getElementById('closePopup').addEventListener('click', () => {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
});
