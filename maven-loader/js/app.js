document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the YAML file
        const response = await fetch('project-data.yaml');
        const yamlText = await response.text();

        // Parse YAML
        const data = jsyaml.load(yamlText);

        console.assert(data.theme);

        // load colors

        if (data.theme.project) {
            document.getElementById('project').style.backgroundColor = data.theme.project;
        }
        if (data.theme.project_text) {
            document.getElementById('project-title').style.color = data.theme.project_text;
            document.getElementById('project-subtitle').style.color = data.theme.project_text;
        }
        if (data.theme.info) {
            document.getElementById('info').style.backgroundColor = data.theme.info;
        }

        // Set title and description
        document.getElementById('title').textContent = data.title + " - " + data.subtitle;
        document.getElementById('project-title').textContent = data.title;
        document.getElementById('project-subtitle').textContent = data.subtitle;

        // render the info section
        const infoContainer = document.getElementById('info-container')
        const infoLines = data.info.split(/\r?\n/);
        infoLines.forEach(line => {
            const infoParagraph = document.createElement('p');
            infoParagraph.textContent = line;

            if (data.theme.info_text) {
                infoParagraph.style.color = data.theme.info_text;
            }

            infoContainer.appendChild(infoParagraph);
        });

        // Populate released versions
        const releaseContainer = document.getElementById('released-versions');

        data.releasedVersions.forEach(version => {
            const releaseRow = document.createElement('tr');
            releaseRow.className = 'version-item mb-3';

            releaseContainer.appendChild(releaseRow);

            // Create a link for the version
            const releaseCell = document.createElement('td');
            const versionLink = document.createElement('a');
            versionLink.className = 'tag is-medium px-4';
            versionLink.href = version.url;
            versionLink.textContent = version.version;

            // Apply custom version tag colors if provided in theme
            if (data.theme.version) {
                versionLink.style.backgroundColor = data.theme.version;
            } else {
                versionLink.classList.add('is-primary'); // Default Bulma class if no custom color
            }

            if (data.theme.version_text) {
                versionLink.style.color = data.theme.version_text;
            }

            releaseCell.appendChild(versionLink);
            releaseRow.appendChild(releaseCell);

            // Create a link for the api docs
            const apidocCell = document.createElement('td');
            const apidocLink = document.createElement('a');
            apidocLink.className = 'is-size-6 px-4';
            apidocLink.href = version.url + "/apidocs/";
            apidocLink.textContent = '[API Documentation]';

            apidocCell.appendChild(apidocLink);
            releaseRow.appendChild(apidocCell);

            // parse date
            // Format date to display only the date part (YYYY-MM-DD)
            let formattedDate = version.date;
            if (version.date instanceof Date) {
                formattedDate = version.date.toISOString().split('T')[0];
            } else if (typeof version.date === 'string' && version.date.includes('T')) {
                formattedDate = version.date.split('T')[0];
            }

            const dateCell = document.createElement('td');
            dateCell.className = 'is-size-7 px-4';
            dateCell.textContent = `Released: ${formattedDate}`;

            releaseRow.appendChild(dateCell);
        });

        // Populate development versions
        const devContainer = document.getElementById('dev-container');
        data.developmentInfo.forEach(info => {
            const infoLink = document.createElement('a');
            infoLink.href = info.url;
            infoLink.className = 'button is-info is-outlined';
            infoLink.textContent = info.name;

            devContainer.appendChild(infoLink);
        });

        // Populate badges
        const devBadges = document.getElementById('dev-badges');
        data.developmentBadges.forEach(badge => {
            const badgeImg = document.createElement('img');
            badgeImg.src = badge.img;

            const badgeLink = document.createElement('a');
            badgeLink.href = badge.url;
            badgeLink.appendChild(badgeImg);

            devBadges.appendChild(badgeLink);
        });

    } catch (error) {
        console.error('Error loading project data:', error);
        document.body.innerHTML = `<div class="notification is-danger">
      <p>Error loading project data: ${error.message}</p>
    </div>`;
    }
});
