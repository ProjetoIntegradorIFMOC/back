<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfessorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
	$professorId = $this->route('professor');

        return [
		'name' => [ 'sometimes', 'string', 'max:255', ],
		'email' => [ 'sometimes', 'string','email', 'max:255', Rule::unique('users', 'email')->ignore($professorId), ],
		'area_atuacao' => [ 'sometimes', 'string', 'max:255', ],
        ];
    }
}
