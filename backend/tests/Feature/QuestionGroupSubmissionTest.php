<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\QuestionGroup;
use App\Models\QuestionType;
use App\Models\TestContext;
use App\Models\TestSection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestionGroupSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_stores_question_group_id_when_submitting_a_question(): void
    {
        $module = Module::create([
            'title' => 'Module One',
            'status' => 'active',
        ]);

        $questionType = QuestionType::create([
            'module_id' => $module->id,
            'name' => 'Multiple Choice',
            'slug' => 'multiple-choice',
            'upload_hints' => null,
        ]);

        $testSection = TestSection::create([
            'test_type' => 'practice',
            'test_id' => 1,
            'title' => 'Section One',
            'module_id' => $module->id,
            'order' => 1,
        ]);

        $questionGroup = QuestionGroup::create([
            'test_section_id' => $testSection->id,
            'question_type_id' => $questionType->id,
            'title' => 'Group One',
            'instruction' => 'Answer the question',
            'sort_order' => 1,
        ]);

        $testContext = TestContext::create([
            'test_section_id' => $testSection->id,
            'passage_text' => 'Sample passage',
            'image' => null,
            'audio' => null,
        ]);

        $response = $this->postJson('/api/question/store', [
            'test_context_id' => $testContext->id,
            'module_id' => $module->id,
            'question_type_id' => $questionType->id,
            'question_group_id' => $questionGroup->id,
            'question_text' => 'What is the answer?',
            'question_mark' => 1,
            'sequence_number' => 1,
            'status' => 'active',
            'options' => [
                [
                    'option_key' => 'A',
                    'option_text' => 'Option A',
                    'is_correct' => true,
                    'meta' => [],
                ],
            ],
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('questions', [
            'question_group_id' => $questionGroup->id,
            'module_id' => $module->id,
            'question_type_id' => $questionType->id,
        ]);
    }
}
