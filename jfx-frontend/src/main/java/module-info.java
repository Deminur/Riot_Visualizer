module front {
    requires javafx.controls;
    requires javafx.fxml;
    requires json.simple;

    opens front to javafx.fxml;
    exports front;
}
