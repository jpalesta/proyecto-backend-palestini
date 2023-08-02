class UserDto {
    constructor(userDto) {
        ;(this.firstName = userDto.user.firstName),
            (this.lastName = userDto.user.lastName),
            (this.dateOfBirth = userDto.user.dateOfBirth),
            (this.role = userDto.user.role),
            // this.password = "",
            (this.email = userDto.user.email),
            (this.age = userDto.user.age)
        // this.cart = ""
    }
}

module.exports = UserDto
