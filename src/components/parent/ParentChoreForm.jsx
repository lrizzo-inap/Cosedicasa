import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { choreSchema } from '../../schemas/validation'; // Correct schema import
// import { validateChore } from '../../schemas/validation'; // <<< INCORRECT IMPORT REMOVED
import toast from 'react-hot-toast'; // For displaying error notifications

const ParentChoreForm = ({ onSubmit, initialData = {} }) => {
    // State for chore data, initialized with defaults or initialData for editing
    const [chore, setChore] = useState({
        name: '',
        description: '',
        points: 0,
        frequency: 'daily', // Default frequency
        ...initialData // Spread initialData to override defaults if provided
    });
    // State to hold validation errors for displaying in the form
    const [validationErrors, setValidationErrors] = useState({});

    // Effect to update form state if initialData changes (e.g., when editing)
    useEffect(() => {
        // Only update if initialData is provided and different from current state
        // This helps prevent resetting the form unintentionally
        if (initialData && Object.keys(initialData).length > 0) {
             setChore({
                name: '',
                description: '',
                points: 0,
                frequency: 'daily',
                ...initialData
            });
             setValidationErrors({}); // Clear errors when loading initial data
        }
    }, [initialData]); // Dependency array includes initialData

    // Handles changes in form inputs
    const handleChange = (event) => {
        const { name, value, type } = event.target;
        setChore(prevChore => ({
            ...prevChore,
            // Convert points to number, handle other inputs as strings
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value
        }));
        // Optionally clear the specific field's error when user types
        if (validationErrors[name]) {
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                [name]: null
            }));
        }
    };

    // Handles form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default browser form submission
        setValidationErrors({}); // Clear previous validation errors

        // --- Corrected Validation Logic ---
        // Validate the current chore state against the imported Joi schema
        const { error } = choreSchema.validate(chore, { abortEarly: false }); // abortEarly: false gets all errors

        // If Joi validation returns an error object
        if (error) {
            // Convert Joi's error details array into an object mapping field names to error messages
            const errors = error.details.reduce((acc, detail) => {
                 // Use path[0] as the key (field name)
                const key = Array.isArray(detail.path) && detail.path.length > 0 ? detail.path[0] : detail.context?.key;
                if (key) {
                    acc[key] = detail.message; // Assign the error message
                } else {
                     // Log a warning if the key couldn't be determined (should be rare with simple schemas)
                     console.warn("Could not determine error key for message:", detail.message);
                }
                return acc;
            }, {});

            setValidationErrors(errors); // Update state with the new errors
            toast.error('Please fix the errors highlighted in the form.'); // Show error toast
            console.log("Validation Errors:", errors); // Log errors for debugging
            return; // Stop the submission process
        }
        // --- End Corrected Validation Logic ---

        // If validation passes (no error object), proceed with submission
        console.log('Validation passed. Submitting Chore:', chore); // Log successful data
        onSubmit(chore); // Call the onSubmit function passed as a prop
    };

    // JSX for the form
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow-md">
            {/* Chore Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Chore Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={chore.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {validationErrors.name && <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>}
            </div>

            {/* Chore Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={chore.description}
                    onChange={handleChange}
                    rows="3"
                    className={`mt-1 block w-full px-3 py-2 border ${validationErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                ></textarea>
                {validationErrors.description && <p className="mt-1 text-xs text-red-600">{validationErrors.description}</p>}
            </div>

            {/* Chore Points */}
            <div>
                <label htmlFor="points" className="block text-sm font-medium text-gray-700">Points:</label>
                <input
                    type="number"
                    id="points"
                    name="points"
                    value={chore.points}
                    onChange={handleChange}
                    min="0" // Prevent negative points via browser validation (Joi handles actual logic)
                    className={`mt-1 block w-full px-3 py-2 border ${validationErrors.points ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {validationErrors.points && <p className="mt-1 text-xs text-red-600">{validationErrors.points}</p>}
            </div>

            {/* Chore Frequency */}
            <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency:</label>
                <select
                    id="frequency"
                    name="frequency"
                    value={chore.frequency}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${validationErrors.frequency ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="onetime">One Time</option>
                </select>
                 {validationErrors.frequency && <p className="mt-1 text-xs text-red-600">{validationErrors.frequency}</p>}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {initialData && Object.keys(initialData).length > 0 ? 'Update Chore' : 'Add Chore'}
            </button>
        </form>
    );
};

// PropTypes for type checking the component's props
ParentChoreForm.propTypes = {
    onSubmit: PropTypes.func.isRequired, // Function to call when form is submitted successfully
    initialData: PropTypes.object        // Optional initial data for editing an existing chore
};

export default ParentChoreForm;
