$(document).ready(function () {
    // Initialize select2 with demo data for Skills and Languages
    $('#skills').select2({
        placeholder: 'Select your skills',
        tags: true, 
        data: [
            { id: 'Programming', text: 'Programming' },
            { id: 'Web Development', text: 'Web Development' },
            { id: 'Graphic Design', text: 'Graphic Design' },
            { id: 'Project Management', text: 'Project Management' },
            { id: 'Data Analysis', text: 'Data Analysis' },
        ],
    });

    $('#languages').select2({
        placeholder: 'Select your languages',
        tags: true, 
        data: [
            { id: 'English', text: 'English' },
            { id: 'Bengali', text: 'Bengali' },
            { id: 'Hindi', text: 'Hindi' },
            { id: 'Spanish', text: 'Spanish' },
            { id: 'French', text: 'French' },
        ],
    });

    // Function to add dynamic rows for education and work experience
    function addEducationRow() {
        const newRow = `
        <div class="educationRow">
            <input type="text" name="qualification[]" placeholder="Qualification" required>
            <input type="text" name="institution[]" placeholder="Institution" required>
            <input type="number" name="graduationYear[]" placeholder="Graduation Year" required>
            <button type="button" class="removeRow">Remove</button>
        </div>`;
        $('#educationSection').append(newRow);
    }


    function addWorkExperienceRow() {
        const newRow = `
        <div class="workRow">
            <input type="text" name="jobTitle[]" placeholder="Job Title" required>
            <input type="text" name="company[]" placeholder="Company Name" required>
            <input type="text" name="duration[]" placeholder="Duration" required>
            <button type="button" class="removeRow">Remove Experience</button>
        </div>`;
        $('#workExperienceSection').append(newRow);
    }

    // Event listener for adding education rows
    $('#educationSection').on('click', '.addEducation', function () {
        addEducationRow();
    });

    // Event listener for adding work experience rows
    $('#workExperienceSection').on('click', '.addWorkExperience', function () {
        addWorkExperienceRow();
    });

    // Remove a row
    $(document).on('click', '.removeRow', function () {
        $(this).parent().remove();
    });

    // AJAX for Division-District
    $('#division').on('change', function () {
        const divisionId = $(this).val();
        console.log(divisionId);

        // Simulating an AJAX request with local data
        $.ajax({
            url: 'divisions.json', 
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Clear the District dropdown
                $('#district').html('<option value="">Select District</option>');

                if (data[divisionId]) {
                    data[divisionId].forEach(function (district) {
                        $('#district').append(`<option value="${district}">${district}</option>`);
                    });
                }
            },
            error: function () {
                alert('Unable to fetch district data. Please check the JSON file path or format.');
            }
        });
    });

    // Populate the Division dropdown on page load 
    const divisions = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi"];
    divisions.forEach(function (division) {
        $('#division').append(`<option value="${division}">${division}</option>`);
    });
});
