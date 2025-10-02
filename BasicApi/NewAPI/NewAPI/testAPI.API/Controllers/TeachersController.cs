using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using testAPI.Application.Services;
using NewAPI.testAPI.Application.DTOs;

namespace testAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeachersController : ControllerBase
    {
        private readonly TeacherService _teacherService;

        public TeachersController(TeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        // GET: api/teachers
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var teachers = await _teacherService.GetAllTeachersAsync();
            return Ok(teachers);
        }

        // GET: api/teachers/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var teacher = await _teacherService.GetTeacherByIdAsync(id);
            if (teacher == null) return NotFound();
            return Ok(teacher);
        }

        // POST: api/teachers
        [HttpPost]
        public async Task<IActionResult> AddTeacher([FromBody] AddTeacherDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var teacher = await _teacherService.AddTeacherAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = teacher.Id }, teacher);
        }

        // PUT: api/teachers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeacher(int id, [FromBody] UpdateTeacherDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updated = await _teacherService.UpdateTeacherAsync(id, dto);
            if (updated == null) return NotFound();

            return Ok(updated);
        }

        // DELETE: api/teachers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var deleted = await _teacherService.DeleteTeacherAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
